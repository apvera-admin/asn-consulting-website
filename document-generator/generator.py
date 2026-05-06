"""
Document generation logic.

Strategy: copy the template .docx byte-for-byte as a ZIP, then open
word/document.xml (and header/footer XML parts), apply only targeted
in-place text-node updates to SDT content controls, and repack — without
ever calling python-docx Document.save(), which strips content Word needs.
"""
import base64
import io
import logging
import os
import zipfile
from datetime import date

from lxml import etree

import config
from field_mapping import get_mapping, COMMON_PLACEHOLDER_MAP
from utils import build_context

logger = logging.getLogger(__name__)

# Word XML namespaces
W         = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"
A_NS      = "http://schemas.openxmlformats.org/drawingml/2006/main"
R_NS      = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

# XML parts inside the ZIP that may contain SDTs and need patching
_PATCH_PARTS = {
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
}

# SDT tag names that are picture / non-text controls — never touch their content
_SKIP_IMAGE_TAGS = {"Imageone", "ImageTwo", "ImagePhoto", "Image Photo"}


# ---------------------------------------------------------------------------
# Low-level SDT helpers
# ---------------------------------------------------------------------------

def _sdt_tag(sdt_el) -> str | None:
    """Return the w:tag value of an SDT, or None."""
    sdtpr = sdt_el.find(f"{{{W}}}sdtPr")
    if sdtpr is None:
        return None
    tag_el = sdtpr.find(f"{{{W}}}tag")
    if tag_el is None:
        return None
    return tag_el.get(f"{{{W}}}val")


def _sdt_placeholder_text(sdt_el) -> str:
    """Return concatenated <w:t> text inside an SDT's sdtContent."""
    content = sdt_el.find(f"{{{W}}}sdtContent")
    if content is None:
        return ""
    return "".join(t.text for t in content.iter(f"{{{W}}}t") if t.text)


def _has_child_sdts(sdt_el) -> bool:
    """True if this SDT's sdtContent contains nested <w:sdt> elements."""
    content = sdt_el.find(f"{{{W}}}sdtContent")
    if content is None:
        return False
    return content.find(f".//{{{W}}}sdt") is not None


def _is_picture_sdt(sdt_el) -> bool:
    """True if the SDT holds a picture/drawing rather than text."""
    # Picture content controls have <w:sdtPr><w:picture/> or no <w:t> at all
    # and contain a <w:drawing> in their content.
    content = sdt_el.find(f"{{{W}}}sdtContent")
    if content is None:
        return False
    if content.find(f".//{{{W}}}drawing") is not None:
        return True
    sdtpr = sdt_el.find(f"{{{W}}}sdtPr")
    if sdtpr is not None:
        if sdtpr.find(f"{{{W}}}picture") is not None:
            return True
    return False


def _replace_text_in_sdt(sdt_el, new_text: str) -> bool:
    """
    Update <w:t> text nodes inside sdt_el's sdtContent IN PLACE.
    Never adds, removes, or reorders XML elements.
    Returns True if any text was updated.
    """
    content = sdt_el.find(f"{{{W}}}sdtContent")
    if content is None:
        return False

    all_t = list(content.iter(f"{{{W}}}t"))
    if not all_t:
        # No text nodes — this SDT holds non-text content (image, drawing…)
        # Do NOT touch it.
        return False

    # Write new_text into the first text node; blank all the rest
    first_t = all_t[0]
    first_t.text = new_text
    if new_text and (new_text[0] == " " or new_text[-1] == " "):
        first_t.set(XML_SPACE, "preserve")
    else:
        first_t.attrib.pop(XML_SPACE, None)

    for t in all_t[1:]:
        t.text = ""
        t.attrib.pop(XML_SPACE, None)

    return True


# ---------------------------------------------------------------------------
# Photo / image helpers
# ---------------------------------------------------------------------------

def _get_image_rids(xml_bytes: bytes, image_tag_names: set) -> list:
    """Return rId strings from <a:blip> elements inside picture SDTs whose tag matches."""
    root = etree.fromstring(xml_bytes)
    rids = []
    for sdt in root.iter(f"{{{W}}}sdt"):
        tag = _sdt_tag(sdt)
        if tag in image_tag_names:
            for blip in sdt.iter(f"{{{A_NS}}}blip"):
                rid = blip.get(f"{{{R_NS}}}embed")
                if rid:
                    rids.append(rid)
    return rids


def _parse_rels(rels_bytes: bytes) -> dict:
    """Parse word/_rels/document.xml.rels, return {rId: path_in_zip} mapping."""
    root = etree.fromstring(rels_bytes)
    result = {}
    for rel in root:
        rid = rel.get("Id", "")
        target = rel.get("Target", "")
        if rid and target:
            # Target is relative to word/; build the full ZIP path
            if target.startswith("/"):
                full_path = target.lstrip("/")
            else:
                full_path = f"word/{target}"
            result[rid] = full_path
    return result


# ---------------------------------------------------------------------------
# Per-part processing
# ---------------------------------------------------------------------------

def _patch_xml_part(xml_bytes: bytes, tag_map: dict, ctx: dict) -> bytes:
    """
    Parse one XML part, apply SDT replacements, return updated bytes.
    The serialisation re-uses lxml's output with the original encoding
    declaration so the file stays byte-compatible except for text values.
    """
    # Detect original encoding from the XML declaration
    encoding = "UTF-8"
    if xml_bytes[:3] == b"\xef\xbb\xbf":         # UTF-8 BOM
        xml_bytes = xml_bytes[3:]                  # strip BOM; lxml adds its own
    if xml_bytes[:5] == b"<?xml":
        decl_end = xml_bytes.index(b"?>")
        decl = xml_bytes[:decl_end + 2].decode("ascii", errors="ignore")
        if 'encoding="' in decl:
            encoding = decl.split('encoding="')[1].split('"')[0]

    root = etree.fromstring(xml_bytes)

    # Walk every SDT in document order
    for sdt in list(root.iter(f"{{{W}}}sdt")):
        # Skip repeating-section containers and picture controls
        if _has_child_sdts(sdt):
            continue
        if _is_picture_sdt(sdt):
            continue

        tag = _sdt_tag(sdt)

        # --- Tagged SDT: use the tag→value map ---
        if tag is not None:
            if tag in _SKIP_IMAGE_TAGS:
                continue
            if tag in tag_map:
                _replace_text_in_sdt(sdt, str(tag_map[tag]))
            continue

        # --- Untagged SDT: use the common placeholder-text map (all docs) ---
        placeholder = _sdt_placeholder_text(sdt)
        ctx_key = COMMON_PLACEHOLDER_MAP.get(placeholder)
        if ctx_key:
            _replace_text_in_sdt(sdt, str(ctx.get(ctx_key, "")))

    return etree.tostring(root, xml_declaration=True,
                          encoding=encoding, standalone=True)


# ---------------------------------------------------------------------------
# No Political Status post-processing (operates on parsed lxml tree)
# ---------------------------------------------------------------------------

POLITICAL_STATUS_LINE = (
    "Supplemental information related to Declarant’s state Citizen status"
)
FOUR_SETS_TEXT  = "four (4) sets"
THREE_SETS_TEXT = "three (3) sets"
DECLARATION_LINE = "Copy of Declaration of Political Status"


def _apply_no_political_status(root):
    """Remove the political-status-specific paragraphs/lines from Cover Letter."""
    paras_to_remove = []
    for para in root.iter(f"{{{W}}}p"):
        texts = [t.text for t in para.iter(f"{{{W}}}t") if t.text]
        full_text = "".join(texts)
        if POLITICAL_STATUS_LINE in full_text or DECLARATION_LINE in full_text:
            paras_to_remove.append(para)
        elif FOUR_SETS_TEXT in full_text:
            for t in para.iter(f"{{{W}}}t"):
                if t.text and FOUR_SETS_TEXT in t.text:
                    t.text = t.text.replace(FOUR_SETS_TEXT, THREE_SETS_TEXT)
    for para in paras_to_remove:
        parent = para.getparent()
        if parent is not None:
            parent.remove(para)


# ---------------------------------------------------------------------------
# ROE 100 Reasons plain-text state replacement
# ---------------------------------------------------------------------------

def _apply_roe_state_replacement(root, ctx: dict):
    """
    Replace bare 'State' and 'STATE' text nodes in ROE 100 Reasons documents.
    These appear as isolated <w:t> nodes (NOT inside SDTs) in item 6 of the
    100 reasons list.  We walk every <w:t> that is NOT a descendant of a
    <w:sdt> and replace exact matches only.
    """
    state_val       = ctx.get("current_state", "")
    state_upper_val = state_val.upper()

    # Collect all SDT elements so we can skip their descendants
    sdt_elements = set(root.iter(f"{{{W}}}sdt"))

    for t in root.iter(f"{{{W}}}t"):
        # Skip any <w:t> that lives inside an SDT
        parent = t.getparent()
        inside_sdt = False
        while parent is not None:
            if parent in sdt_elements:
                inside_sdt = True
                break
            parent = parent.getparent()
        if inside_sdt:
            continue

        if t.text == "State":
            t.text = state_val
        elif t.text == "STATE":
            t.text = state_upper_val


# ---------------------------------------------------------------------------
# Single-document generation (zipfile-based)
# ---------------------------------------------------------------------------

def generate_document(template_path: str, output_path: str,
                       tag_map: dict, ctx: dict,
                       no_political_status: bool = False,
                       roe_100_reasons: bool = False,
                       photo_bytes: bytes = None) -> list:
    """
    Generate one document by:
      1. Copying the template ZIP entry-by-entry
      2. Patching only the XML parts that contain SDTs
      3. Optionally replacing picture SDT images with photo_bytes
      4. Writing the result to output_path
    No python-docx Document.save() is used, so nothing is ever stripped.
    """
    warnings = []
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Pre-scan: discover which media paths to replace when photo provided
    media_paths_to_replace = set()
    if photo_bytes:
        try:
            with zipfile.ZipFile(template_path, "r") as zin:
                doc_xml = zin.read("word/document.xml")
                rids = _get_image_rids(doc_xml, _SKIP_IMAGE_TAGS)
                if rids:
                    rels_bytes = zin.read("word/_rels/document.xml.rels")
                    rels_map = _parse_rels(rels_bytes)
                    for rid in rids:
                        path = rels_map.get(rid)
                        if path:
                            media_paths_to_replace.add(path)
        except Exception as exc:
            warnings.append(f"Photo pre-scan warning: {exc}")

    try:
        with zipfile.ZipFile(template_path, "r") as zin, \
             zipfile.ZipFile(output_path, "w",
                             compression=zipfile.ZIP_DEFLATED) as zout:

            for item in zin.infolist():
                data = zin.read(item.filename)

                # Replace photo bytes for matched media files
                if photo_bytes and item.filename in media_paths_to_replace:
                    data = photo_bytes

                elif item.filename in _PATCH_PARTS:
                    try:
                        data = _patch_xml_part(data, tag_map, ctx)
                        # Post-processing: political-status removal for Cover Letters
                        if no_political_status and "Cover" in template_path:
                            root = etree.fromstring(data)
                            _apply_no_political_status(root)
                            data = etree.tostring(root, xml_declaration=True,
                                                  encoding="UTF-8",
                                                  standalone=True)
                        # Post-processing: plain-text State/STATE fix for ROE 100 Reasons
                        if roe_100_reasons:
                            root = etree.fromstring(data)
                            _apply_roe_state_replacement(root, ctx)
                            data = etree.tostring(root, xml_declaration=True,
                                                  encoding="UTF-8",
                                                  standalone=True)
                    except Exception as exc:
                        warnings.append(
                            f"Error patching {item.filename}: {exc}")
                        logger.exception("Patch error in %s", item.filename)

                zout.writestr(item, data)

    except Exception as exc:
        raise RuntimeError(f"Failed to generate {os.path.basename(output_path)}: {exc}") from exc

    return warnings


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def generate_all_documents(form_data: dict) -> dict:
    """
    Build context, choose templates, generate all documents.

    Returns:
        { success, output_folder, files_generated, warnings, errors }
    """
    ctx     = build_context(form_data)
    tag_map = get_mapping(ctx)

    today_str     = date.today().strftime("%Y-%m-%d")
    folder_name   = f"{ctx['last_name']} {ctx['first_name']} - {today_str}"
    output_folder = os.path.join(config.OUTPUT_DIR, folder_name)
    os.makedirs(output_folder, exist_ok=True)

    client_label    = f"{ctx['first_name']} {ctx['last_name']}"
    files_generated = []
    warnings_all    = []
    errors_all      = []

    def tpl(name):
        return os.path.join(config.TEMPLATE_DIR, name)

    def out(label):
        return os.path.join(output_folder, f"{label} - {client_label}.docx")

    # ------------------------------------------------------------------
    # Alternate-name Acts of Expatriation
    # Each name after a semicolon in any name field gets its own copy.
    # ------------------------------------------------------------------
    expatriation_tpl = tpl("Act of Expatriation Additional - State Nationals.docx")

    def _alternate_expat_jobs():
        """Yield one job dict per alternate name (after semicolons)."""
        field_alts = [
            ("first_name",  ctx["first_name_raw"],  "middle_name",  ctx["middle_name"],  "last_name",  ctx["last_name"]),
            ("middle_name", ctx["middle_name_raw"], "first_name",   ctx["first_name"],   "last_name",  ctx["last_name"]),
            ("last_name",   ctx["last_name_raw"],   "first_name",   ctx["first_name"],   "middle_name", ctx["middle_name"]),
        ]
        seen = set()
        for changed_field, raw_val, f2, v2, f3, v3 in field_alts:
            alts = [n.strip() for n in raw_val.split(";")[1:] if n.strip()]
            for alt in alts:
                if alt in seen:
                    continue
                seen.add(alt)
                alt_form               = dict(form_data)
                alt_form[changed_field] = alt
                alt_form[f2]            = v2
                alt_form[f3]            = v3
                alt_ctx     = build_context(alt_form)
                alt_tag_map = get_mapping(alt_ctx)
                alt_label   = alt_ctx["full_name"]
                yield {
                    "label":    f"Act of Expatriation ({alt})",
                    "template": expatriation_tpl,
                    "output":   os.path.join(output_folder,
                                             f"Act of Expatriation ({alt_label}) - {client_label}.docx"),
                    "tag_map":  alt_tag_map,
                    "ctx":      alt_ctx,
                }

    # ------------------------------------------------------------------
    # Always-generated documents
    # ------------------------------------------------------------------
    jobs = [
        {
            "label":    "Status Correction Documents",
            "template": tpl("Master 928 Docs Originals - State Nationals.docx"),
            "output":   out("Status Correction Documents"),
        },
        {
            "label":    "Act of Expatriation",
            "template": expatriation_tpl,
            "output":   out("Act of Expatriation"),
        },
        {
            "label":    "Fee Schedule",
            "template": tpl("Fee Schedule.docx"),
            "output":   out("Fee Schedule"),
        },
    ]

    # Add one Act of Expatriation per alternate name
    jobs += list(_alternate_expat_jobs())

    # ------------------------------------------------------------------
    # ROE documents (conditional)
    # ------------------------------------------------------------------
    if ctx["include_roe"] == "Yes":
        gender   = ctx["gender"]          # "Man" or "Woman"
        business = ctx["business_roe"] == "Yes"

        reasons_tpl = (
            "ROE 100 Reasons - woman.docx"
            if gender == "Woman"
            else "ROE 100 Reasons - Man.docx"
        )
        cover_tpl = (
            f"ROE Cover Letter - {gender} (Business Version).docx"
            if business
            else f"ROE Cover Letter - {gender}.docx"
        )
        test_tpl = (
            f"ROE Testimony - {gender.upper()} (Business Version).docx"
            if business
            else f"ROE Testimony - {gender.upper()}.docx"
        )

        jobs += [
            {
                "label":       "ROE 100 Reasons",
                "template":    tpl(reasons_tpl),
                "output":      out("ROE 100 Reasons"),
                "roe_100":     True,
            },
            {
                "label":    "ROE Cover Letter",
                "template": tpl(cover_tpl),
                "output":   out("ROE Cover Letter"),
                "no_pol":   not ctx["has_political_status"],
            },
            {
                "label":    "ROE Testimony",
                "template": tpl(test_tpl),
                "output":   out("ROE Testimony"),
                "photo":    True,
            },
        ]

    # ------------------------------------------------------------------
    # Decode photo (used by ROE Testimony pages 14-15)
    # ------------------------------------------------------------------
    photo_bytes = None
    photo_b64 = form_data.get("photo_base64", "")
    if photo_b64:
        try:
            if "," in photo_b64:
                photo_b64 = photo_b64.split(",", 1)[1]
            photo_bytes = base64.b64decode(photo_b64)
        except Exception:
            logger.warning("Failed to decode photo_base64")

    # ------------------------------------------------------------------
    # Execute all jobs
    # ------------------------------------------------------------------
    for job in jobs:
        label    = job["label"]
        tpl_path = job["template"]
        out_path = job["output"]
        # Jobs for alternate names carry their own tag_map/ctx; others use primary
        job_tag_map = job.get("tag_map", tag_map)
        job_ctx     = job.get("ctx",     ctx)

        if not os.path.isfile(tpl_path):
            msg = f"Template not found: {os.path.basename(tpl_path)}"
            errors_all.append(msg)
            logger.error(msg)
            continue

        try:
            warns = generate_document(
                template_path       = tpl_path,
                output_path         = out_path,
                tag_map             = job_tag_map,
                ctx                 = job_ctx,
                no_political_status = job.get("no_pol",   False),
                roe_100_reasons     = job.get("roe_100",  False),
                photo_bytes         = photo_bytes if job.get("photo") else None,
            )
            warnings_all.extend(warns)
            files_generated.append(os.path.basename(out_path))
            logger.info("Generated: %s", os.path.basename(out_path))
        except Exception as exc:
            msg = str(exc)
            errors_all.append(msg)
            logger.exception(msg)

    return {
        "success":         len(errors_all) == 0,
        "output_folder":   output_folder,
        "files_generated": files_generated,
        "warnings":        warnings_all,
        "errors":          errors_all,
    }

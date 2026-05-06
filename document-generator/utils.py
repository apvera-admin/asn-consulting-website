"""
Utility functions: date calculations, name formatting, ordinal numbers,
state abbreviation lookups.
"""
import json
import os
from datetime import date, datetime


# ---------------------------------------------------------------------------
# State abbreviation lookup
# ---------------------------------------------------------------------------

_STATE_ABBREVS = None

def _load_state_abbrevs():
    global _STATE_ABBREVS
    if _STATE_ABBREVS is None:
        path = os.path.join(os.path.dirname(__file__), "reference_data", "state_abbreviations.json")
        with open(path, "r", encoding="utf-8") as f:
            raw = json.load(f)
        # Build case-insensitive lookup
        _STATE_ABBREVS = {k.lower(): v for k, v in raw.items()}
    return _STATE_ABBREVS


def state_abbreviation(state_name: str) -> str:
    """Return 2-letter abbreviation for a US state name (case-insensitive)."""
    abbrevs = _load_state_abbrevs()
    return abbrevs.get(state_name.strip().lower(), "")


# ---------------------------------------------------------------------------
# Ordinal numbers
# ---------------------------------------------------------------------------

def ordinal(n: int) -> str:
    """Return ordinal string for integer n, e.g. 39 -> '39th'."""
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


# ---------------------------------------------------------------------------
# Date formatting helpers
# ---------------------------------------------------------------------------

def format_date_long(d: date) -> str:
    """Format a date as 'Month D, YYYY' (no leading zero on day)."""
    return f"{d.strftime('%B')} {d.day}, {d.year}"


def format_date_upper_no_comma(d: date) -> str:
    """Format a date as 'MONTH DD YYYY' (uppercase, 2-digit day, no comma)."""
    return d.strftime("%B %d %Y").upper()


# ---------------------------------------------------------------------------
# Main context builder
# ---------------------------------------------------------------------------

def build_context(form: dict) -> dict:
    """
    Build the full context dictionary from raw form data.
    All computed variables are derived here.
    """
    # ---- Raw form fields ----
    # Names may contain semicolon-separated alternates ("Katheryn;Kathryn").
    # The primary name is the first entry (most current); alternates follow.
    def _primary(s: str) -> str:
        """Return the first semicolon-separated token, stripped."""
        return s.split(";")[0].strip()

    first_name_raw  = form.get("first_name", "").strip()
    middle_name_raw = form.get("middle_name", "").strip()
    last_name_raw   = form.get("last_name", "").strip()

    # Primary (current) names — used everywhere unless noted
    first_name  = _primary(first_name_raw)
    middle_name = _primary(middle_name_raw)
    last_name   = _primary(last_name_raw)

    gender       = form.get("gender", "Man").strip()          # "Man" or "Woman"
    maiden_name  = form.get("maiden_name", "").strip()
    dob_str      = form.get("date_of_birth", "")              # YYYY-MM-DD

    current_county  = form.get("current_county", "").strip()
    current_street  = form.get("current_street", "").strip()
    current_city    = form.get("current_city", "").strip()
    current_state   = form.get("current_state", "").strip()
    current_zip     = form.get("current_zip", "").strip()

    born_in_america      = form.get("born_in_america", "Yes").strip()
    birth_county         = form.get("birth_county", "").strip()
    birth_city           = form.get("birth_city", "").strip()
    birth_state          = form.get("birth_state", "").strip()
    foreign_birth_location = form.get("foreign_birth_location", "").strip()

    post_office_address = form.get("post_office_address", "").strip()
    post_office_zip     = form.get("post_office_zip", "").strip()

    father_name          = form.get("father_name", "").strip()
    mother_name_married  = form.get("mother_name_married", "").strip()
    mother_maiden_name   = form.get("mother_maiden_name", "").strip()
    parents_married      = form.get("parents_married", "No").strip()
    parents_wedding_date     = form.get("parents_wedding_date", "").strip()
    parents_wedding_location = form.get("parents_wedding_location", "").strip()

    state_identity = form.get("state_identity", "").strip()
    ssn            = form.get("ssn", "").strip()

    include_roe  = form.get("include_roe", "No").strip()
    business_roe = form.get("business_roe", "No").strip()

    # Political status flag (hidden/advanced; defaults True for internal use)
    has_political_status = form.get("has_political_status", "Yes").strip() == "Yes"

    # ---- Parse date of birth ----
    try:
        dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        dob = date(2000, 1, 1)  # fallback

    today = date.today()

    # ---- Name formatting ----
    parts = [p for p in [first_name, middle_name, last_name] if p]
    full_name        = " ".join(parts)
    full_name_upper  = full_name.upper()
    first_upper      = first_name.upper()
    middle_upper     = middle_name.upper()
    last_upper       = last_name.upper()

    # Middle initial (with and without dot)
    middle_initial        = (middle_name[0].upper() + ".") if middle_name else ""
    middle_initial_no_dot = middle_name[0].upper() if middle_name else ""

    # "John J. Doe" style
    mi_parts = [p for p in [first_name, middle_initial, last_name] if p]
    name_with_initial = " ".join(mi_parts)

    # "John J Doe" (no dot) style — used in some templates
    mi_no_dot_parts = [p for p in [first_name, middle_initial_no_dot, last_name] if p]
    name_with_initial_no_dot = " ".join(mi_no_dot_parts)

    # "John Doe"
    first_last       = f"{first_name} {last_name}".strip()
    first_last_upper = f"{first_upper} {last_upper}".strip()

    # Conditional last name (man = last, woman = maiden if provided)
    last_name_cond = maiden_name if (gender == "Woman" and maiden_name) else last_name

    # LastNee field: "Miller (nee' Smith)" for women, just "Miller" for men
    if gender == "Woman" and maiden_name:
        last_nee_full = f"{last_name} (nee' {maiden_name})"
    else:
        last_nee_full = last_name

    # FIRST INITIAL LAST (uppercase, no dot)
    first_mi_last_upper = " ".join(
        p for p in [first_upper, middle_initial_no_dot, last_upper] if p
    )

    # ---- Date calculations ----
    birth_date_formal        = format_date_long(dob)                    # "July 22, 1979"
    birth_date_upper_no_comma = format_date_upper_no_comma(dob)         # "JULY 22 1979"

    try:
        birth_plus_21 = dob.replace(year=dob.year + 21)
    except ValueError:
        # Leap year edge case (Feb 29 + 21 years)
        birth_plus_21 = dob.replace(year=dob.year + 21, day=28)
    birth_year_plus_21 = format_date_long(birth_plus_21)                # "July 22, 2000"

    try:
        minus_10 = today.replace(year=today.year - 10)
    except ValueError:
        minus_10 = today.replace(year=today.year - 10, day=28)
    current_minus_10_years = f"{minus_10.strftime('%B')} {minus_10.strftime('%d')}, {minus_10.year}"

    ordinal_age   = ordinal(today.year - dob.year)
    current_date  = today.strftime("%Y-%m-%d")
    current_month = today.strftime("%B")
    current_day   = today.strftime("%d")
    current_year  = str(today.year)

    # Cover letter date header: "March 23" (no leading zero, no year)
    current_month_day = f"{current_month} {today.day}"

    # ---- Gender variables ----
    he_she         = "he"  if gender == "Man" else "she"
    his_her        = "his" if gender == "Man" else "her"
    daughter_son   = "son" if gender == "Man" else "daughter"
    man_woman_lower = "man" if gender == "Man" else "woman"
    gender_string  = gender  # "Man" or "Woman"

    # ---- State abbreviations ----
    current_state_abbrev = state_abbreviation(current_state)
    birth_state_abbrev   = state_abbreviation(birth_state)

    # ---- Birth/current same state ----
    birth_and_current_same = (birth_state.lower() == current_state.lower())

    # ---- Native or naturalized ----
    native_or_naturalized = "native" if born_in_america == "Yes" else "naturalized"
    # Space preserved for native-born (matches original template behaviour)
    additional_text = foreign_birth_location if born_in_america == "No" else " "

    # ---- Mother full name with nee ----
    mother_full_with_nee = f"{mother_name_married} (nee' {mother_maiden_name})" if mother_maiden_name else mother_name_married

    # ---- Marriage lines ----
    if parents_married == "Yes":
        marriage_line  = (
            f"Wed Together {parents_wedding_date} in "
            f"{parents_wedding_location} The United States of America"
        )
        marriage_line_2 = f"who were legally married in {parents_wedding_location}"
    else:
        marriage_line   = ""
        marriage_line_2 = "whose parents were not married at the time of birth"

    # ---- Assembled current address ----
    current_full_address      = f"{current_street}, {current_city}, {current_state}"
    current_city_state        = f"{current_city}, {current_state}"
    current_city_state_upper  = current_city_state.upper()

    # ---- Birth city/state composite ----
    if birth_city:
        birth_city_state = f"{birth_city}, {birth_state}"
    else:
        birth_city_state = birth_state

    # ---- Additional name formats ----
    # "Last, First Middle" — used in some Master 928 untagged SDTs
    if middle_name:
        last_first_middle = f"{last_name}, {first_name} {middle_name}"
    else:
        last_first_middle = f"{last_name}, {first_name}"

    # Birth year as plain string
    birth_year = str(dob.year)

    # ---- Names repeating sections (page 1 header) ----
    page1_names_repeating = (
        f"{full_name}, {name_with_initial_no_dot}, {first_last}, "
        f"{full_name_upper}, {first_mi_last_upper}, "
        f"{first_upper} {last_upper}"
    )
    page7_names_repeating = (
        f"{full_name_upper}, {first_mi_last_upper}, "
        f"{first_upper} {last_upper},"
    )

    # ---- Static links ----
    website_link  = "https://www.asnconsulting.co/services"
    telegram_link = "https://t.me/+w5VkXBjz_fA4MDgx"

    return {
        # Raw fields (primary names — first token before any semicolon)
        "first_name":              first_name,
        "middle_name":             middle_name,
        "last_name":               last_name,
        # Raw inputs including all semicolon-separated alternates
        "first_name_raw":          first_name_raw,
        "middle_name_raw":         middle_name_raw,
        "last_name_raw":           last_name_raw,
        "gender":                  gender,
        "maiden_name":             maiden_name,
        "date_of_birth":           dob_str,
        "current_county":          current_county,
        "current_street":          current_street,
        "current_city":            current_city,
        "current_state":           current_state,
        "current_zip":             current_zip,
        "born_in_america":         born_in_america,
        "birth_county":            birth_county,
        "birth_city":              birth_city,
        "birth_state":             birth_state,
        "foreign_birth_location":  foreign_birth_location,
        "post_office_address":     post_office_address,
        "post_office_zip":         post_office_zip,
        "father_name":             father_name,
        "mother_name_married":     mother_name_married,
        "mother_maiden_name":      mother_maiden_name,
        "parents_married":         parents_married,
        "parents_wedding_date":    parents_wedding_date,
        "parents_wedding_location": parents_wedding_location,
        "state_identity":          state_identity,
        "ssn":                     ssn,
        "include_roe":             include_roe,
        "business_roe":            business_roe,
        "has_political_status":    has_political_status,

        # Computed name fields
        "full_name":               full_name,
        "full_name_upper":         full_name_upper,
        "first_upper":             first_upper,
        "middle_upper":            middle_upper,
        "last_upper":              last_upper,
        "middle_initial":          middle_initial,
        "middle_initial_no_dot":   middle_initial_no_dot,
        "name_with_initial":       name_with_initial,
        "name_with_initial_no_dot": name_with_initial_no_dot,
        "first_last":              first_last,
        "first_last_upper":        first_last_upper,
        "last_name_cond":          last_name_cond,
        "last_nee_full":           last_nee_full,
        "first_mi_last_upper":     first_mi_last_upper,

        # Dates
        "dob":                     dob,
        "today":                   today,
        "birth_date_formal":       birth_date_formal,
        "birth_date_upper_no_comma": birth_date_upper_no_comma,
        "birth_year_plus_21":      birth_year_plus_21,
        "current_minus_10_years":  current_minus_10_years,
        "ordinal_age":             ordinal_age,
        "current_date":            current_date,
        "current_month":           current_month,
        "current_day":             current_day,
        "current_year":            current_year,
        "current_month_day":       current_month_day,

        # Gender
        "he_she":                  he_she,
        "his_her":                 his_her,
        "daughter_son":            daughter_son,
        "man_woman_lower":         man_woman_lower,
        "gender_string":           gender_string,

        # State
        "current_state_abbrev":    current_state_abbrev,
        "birth_state_abbrev":      birth_state_abbrev,
        "birth_and_current_same":  birth_and_current_same,

        # Conditional text
        "native_or_naturalized":   native_or_naturalized,
        "additional_text":         additional_text,
        "mother_full_with_nee":    mother_full_with_nee,
        "marriage_line":           marriage_line,
        "marriage_line_2":         marriage_line_2,

        # Addresses
        "current_full_address":    current_full_address,
        "current_city_state":      current_city_state,
        "current_city_state_upper": current_city_state_upper,
        "birth_city_state":        birth_city_state,

        # Additional name formats
        "last_first_middle":       last_first_middle,
        "birth_year":              birth_year,
        "father_name":             father_name,

        # Repeating section strings
        "page1_names_repeating":   page1_names_repeating,
        "page7_names_repeating":   page7_names_repeating,

        # Static
        "website_link":            website_link,
        "telegram_link":           telegram_link,
    }

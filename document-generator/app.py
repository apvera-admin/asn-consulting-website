"""
ASN Consulting Document Generator — Flask Application

Run locally:  python app.py  → opens http://localhost:5000
Deployed on Railway: serves as an API for the Next.js app
"""
import io
import logging
import os
import subprocess
import zipfile

from flask import Flask, jsonify, render_template, request, send_file
from flask_cors import CORS

import config
from generator import generate_all_documents

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.secret_key = config.SECRET_KEY

# Allow requests from the Next.js app
CORS(app, origins=[
    "http://localhost:3000",
    "https://asnconsulting.co",
    "https://www.asnconsulting.co",
])

# ---------------------------------------------------------------------------
# Startup checks
# ---------------------------------------------------------------------------
def startup_checks():
    """Verify templates exist and output directory is ready."""
    issues = []
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    missing = [
        t for t in config.REQUIRED_TEMPLATES
        if not os.path.isfile(os.path.join(config.TEMPLATE_DIR, t))
    ]
    if missing:
        issues.append("Missing templates: " + ", ".join(missing))
    if issues:
        for issue in issues:
            logger.warning("Startup check: %s", issue)
    else:
        logger.info("All %d templates found.", len(config.REQUIRED_TEMPLATES))
    return issues


STARTUP_ISSUES = []


# ---------------------------------------------------------------------------
# Original local routes (unchanged — local tool still works)
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return render_template("form.html", startup_issues=STARTUP_ISSUES)


@app.route("/generate", methods=["POST"])
def generate():
    """Original endpoint — used by the local HTML form."""
    form_data = request.form.to_dict()
    logger.info(
        "Generating documents for %s %s",
        form_data.get("first_name", "?"),
        form_data.get("last_name", "?"),
    )
    result = generate_all_documents(form_data)
    return jsonify(result)


@app.route("/open_folder")
def open_folder():
    """Open the output folder in Windows Explorer (local only)."""
    folder = request.args.get("path", "")
    if folder and os.path.isdir(folder):
        try:
            subprocess.Popen(["explorer", os.path.normpath(folder)])
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500
    return jsonify({"ok": True})


@app.route("/health")
def health():
    return jsonify({"status": "ok", "startup_issues": STARTUP_ISSUES})


# ---------------------------------------------------------------------------
# NEW: API endpoint for the Next.js online version
# ---------------------------------------------------------------------------

@app.route("/api/generate", methods=["POST"])
def api_generate():
    """
    API endpoint called by the Next.js dashboard.
    Accepts JSON form data, generates documents, returns a ZIP file download.

    Requires API key authentication via X-API-Key header.
    Set GENERATOR_API_KEY environment variable in Railway.
    """
    api_key = request.headers.get("X-API-Key", "")
    expected_key = os.environ.get("GENERATOR_API_KEY", "")

    if not expected_key:
        logger.warning("GENERATOR_API_KEY not set — all requests rejected")
        return jsonify({"error": "Server misconfigured"}), 500

    if api_key != expected_key:
        logger.warning("Unauthorized API request")
        return jsonify({"error": "Unauthorized"}), 401

    body = request.get_json(force=True, silent=True)
    if not body:
        return jsonify({"error": "Invalid JSON body"}), 400

    form_data = body.get("form_data", {})
    if not form_data:
        return jsonify({"error": "form_data is required"}), 400

    logger.info(
        "API: Generating documents for %s %s",
        form_data.get("first_name", "?"),
        form_data.get("last_name", "?"),
    )

    try:
        result = generate_all_documents(form_data)
    except Exception as exc:
        logger.exception("Generation error")
        return jsonify({"error": str(exc)}), 500

    if not result["success"]:
        return jsonify({
            "error": "Document generation failed",
            "details": result["errors"],
        }), 500

    # Package all generated files into a ZIP in memory
    output_folder = result["output_folder"]
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for filename in result["files_generated"]:
            file_path = os.path.join(output_folder, filename)
            if os.path.isfile(file_path):
                zf.write(file_path, filename)

    zip_buffer.seek(0)

    client_name = f"{form_data.get('first_name', 'Client')} {form_data.get('last_name', '')}".strip()
    zip_filename = f"ASN Documents - {client_name}.zip"

    return send_file(
        zip_buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name=zip_filename,
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    STARTUP_ISSUES = startup_checks()
    logger.info(
        "Starting ASN Document Generator at http://%s:%s",
        config.HOST, config.PORT
    )
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

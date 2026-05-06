"""
ASN Consulting Document Generator — Flask Application
Run with:  python app.py
Then open: http://localhost:5000
"""
import logging
import os
import subprocess
import sys
import threading
import webbrowser

from flask import Flask, jsonify, render_template, request

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


# ---------------------------------------------------------------------------
# Startup checks
# ---------------------------------------------------------------------------
def startup_checks():
    """Verify templates exist and output directory is ready."""
    issues = []

    # Output dir
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)

    # Templates
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
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return render_template("form.html", startup_issues=STARTUP_ISSUES)


@app.route("/generate", methods=["POST"])
def generate():
    """Receive form submission, generate documents, return JSON result."""
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
    """Open the output folder in Windows Explorer."""
    folder = request.args.get("path", "")
    if folder and os.path.isdir(folder):
        try:
            # Windows: open with Explorer
            subprocess.Popen(["explorer", os.path.normpath(folder)])
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500
    return jsonify({"ok": True})


@app.route("/health")
def health():
    return jsonify({"status": "ok", "startup_issues": STARTUP_ISSUES})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def open_browser():
    webbrowser.open(f"http://{config.HOST}:{config.PORT}/")


if __name__ == "__main__":
    STARTUP_ISSUES = startup_checks()

    # Auto-open browser after a short delay so Flask has time to bind
    timer = threading.Timer(1.2, open_browser)
    timer.daemon = True
    timer.start()

    logger.info(
        "Starting ASN Document Generator at http://%s:%s",
        config.HOST, config.PORT
    )
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

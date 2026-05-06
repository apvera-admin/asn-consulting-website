"""
Configuration for ASN Document Generator.
Works locally and on Railway.
"""
import os

# Base directory of the app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Template directory (Word .docx templates)
TEMPLATE_DIR = os.path.join(BASE_DIR, "document_templates")

# Output directory — use /tmp on Railway (ephemeral), local folder otherwise
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", os.path.join(BASE_DIR, "completed_documents"))

# Reference data
STATE_ABBREVIATIONS_PATH = os.path.join(
    BASE_DIR, "reference_data", "state_abbreviations.json"
)

# Required template filenames
REQUIRED_TEMPLATES = [
    "Master 928 Docs Originals - State Nationals.docx",
    "Act of Expatriation Additional - State Nationals.docx",
    "Fee Schedule.docx",
    "ROE 100 Reasons - Man.docx",
    "ROE 100 Reasons - woman.docx",
    "ROE Cover Letter - Man.docx",
    "ROE Cover Letter - Man (Business Version).docx",
    "ROE Cover Letter - Woman.docx",
    "ROE Cover Letter - Woman (Business Version).docx",
    "ROE Testimony - MAN.docx",
    "ROE Testimony - MAN (Business Version).docx",
    "ROE Testimony - WOMAN.docx",
    "ROE Testimony - WOMAN (Business Version).docx",
]

# Flask / server settings
SECRET_KEY = os.environ.get("SECRET_KEY", "asn-doc-gen-local-2026")
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
PORT = int(os.environ.get("PORT", 5000))
HOST = "0.0.0.0"  # Must be 0.0.0.0 for Railway — not 127.0.0.1

"""
Configuration for ASN Document Generator.
"""
import os

# Base directory of the app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Template directory (Word .docx templates)
TEMPLATE_DIR = os.path.join(BASE_DIR, "document_templates")

# Output directory (completed documents go here)
OUTPUT_DIR = os.path.join(BASE_DIR, "completed_documents")

# Reference data
STATE_ABBREVIATIONS_PATH = os.path.join(BASE_DIR, "reference_data", "state_abbreviations.json")

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

# Flask settings
SECRET_KEY = "asn-doc-gen-local-2026"
DEBUG = False
PORT = 5000
HOST = "127.0.0.1"

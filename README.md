Reflectra 🚀

Mood-driven productivity app — Django + React + Neon PostgreSQL

This guide gets you from a fresh machine to a local app running end-to-end, with step-by-step checks ✅ and fast fixes 🧯.

📚 Table of Contents

0) What we’re building (stack + modules)

1) Prerequisites (install once)

2) Clone & create your Virtual Environment (venv)

3) Backend dependencies (Django + REST + PostgreSQL)

4) Configure your environment variables

5) Verify database connectivity (critical)

6) Run the backend (Django)

7) Frontend setup (React + TypeScript via Vite)

8) “Am I caught up?” checklist

9) Common problems → Fast fixes

10) Optional but recommended (quality tools)

11) Deployment (preview)

12) Glossary (acronyms—expanded once)

Appendix A — If starting fresh (no backend yet)

🧩 0) What we’re building (stack + modules)

Frontend

React + TypeScript (Vite)

Tailwind CSS

Zustand (state)

React Router

Recharts (charts)

Backend

Django

Django REST Framework (DRF — Django Representational State Transfer Framework)

Simple JSON Web Token (JWT) auth

CORS (Cross-Origin Resource Sharing)

drf-spectacular (OpenAPI docs)

Database

Neon (hosted PostgreSQL)

All connections use Transport Layer Security (TLS)

⚠️ Campus networks may block port 5432

Core features (MVP)

Mood entries + notes (+ analytics)

Tasks + Goals

Reminders scaffold (email later)

Social follow + lightweight notifications

Daily quote by mood + daily quiz

Optional AI coach (only if key present)

🛠️ 1) Prerequisites (install once)

You need the following tools. Use the checks below to verify and fix.

Tool	Check	Expected	Install / Fix
Python 3.11+ (with pip, venv)	python --version / pip --version (Windows alt: py --version)	Python 3.11+	Windows: python.org installer (check “Add Python to PATH”). macOS: brew install python@3.12. Ubuntu: sudo apt update && sudo apt install -y python3 python3-venv python3-pip.
Git	git --version	2.x	Windows: git-scm.com. macOS: brew install git. Ubuntu: sudo apt install -y git.
Node.js 18+ & npm	node -v / npm -v	Node ≥ 18, npm ≥ 9	nodejs.org (LTS) or brew install node on macOS.
PostgreSQL client (psql)	psql --version	14+	Windows (Chocolatey): choco install postgresql (client included). macOS: brew install libpq && echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zprofile && source ~/.zprofile. Ubuntu: sudo apt install -y postgresql-client.
Visual Studio Code	—	—	code.visualstudio.com + Python extension recommended.

If python runs an old version

Windows: py -3.12 -m venv .venv (explicitly choose 3.12)

macOS/Linux: install newer Python, then call python3.12 directly

🐣 2) Clone & create your Virtual Environment (venv)

A Virtual Environment isolates project Python packages.

git clone https://github.com/Gabriel-Valenzona/reflectra.git
cd reflectra


Create & activate venv

Windows (PowerShell)

# Create (prefer 3.12 if available)
py -3.12 -m venv .venv
# Activate
.venv\Scripts\Activate.ps1


If you see “running scripts is disabled”:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
.venv\Scripts\Activate.ps1


macOS/Linux

python3 -m venv .venv
source .venv/bin/activate


✅ Expected: your shell prompt shows (.venv).

🧱 3) Backend dependencies (Django + REST + PostgreSQL)

With (.venv) active:

python -m pip install --upgrade pip
pip install Django==5.1.1 djangorestframework==3.15.2 \
  django-cors-headers==4.4.0 drf-spectacular==0.27.2 \
  'psycopg[binary]==3.2.1' django-environ==0.11.2 \
  djangorestframework-simplejwt==5.3.1


Why these

psycopg[binary] → PostgreSQL driver (prebuilt, no compiler needed)

django-environ → load secrets from .env

DRF / Simple JWT / CORS / Spectacular → production-leaning API scaffolding

🧯 If install fails

Ensure quotes around 'psycopg[binary]==3.2.1' on shells that expand brackets.

Upgrade pip:
python -m pip install --upgrade pip setuptools wheel.

🔐 4) Configure your environment variables

Create a file named .env (never commit this):

DEBUG=True
# Generate a strong secret (any long random string is fine for dev)
SECRET_KEY=changeme_please_make_this_random

# Paste YOUR Neon connection string (no quotes)
# Example format (do not paste secrets into Git):
# postgresql://USER:PASSWORD@HOST/DB?sslmode=require&channel_binding=require
DATABASE_URL=postgresql://<USER>:<PASS>@<HOST>/<DB>?sslmode=require&channel_binding=require

# Frontend dev origin
CORS_ALLOWED_ORIGINS=http://localhost:5173
ALLOWED_HOSTS=localhost,127.0.0.1


🔒 Security: Don’t commit .env. If a real password ever leaks, rotate it in Neon and update this file.

🧪 5) Verify database connectivity (critical)

Test with psql (works even before Django):

psql "<paste your DATABASE_URL here>" -c "\conninfo"


✅ Expected (success)

A table showing: Database, Client User, Host, Server Port: 5432

SSL Protocol: TLSv1.3, SSL Cipher: TLS_AES_256_GCM_SHA384

🧯 If it fails

Campus Wi-Fi blocks 5432 → Use personal hotspot (recommended)
or a VPN with split tunneling (exclude psql.exe so DB traffic bypasses VPN).

Using VPN and get “server closed the connection unexpectedly” →
Dev-only workaround: change the URL to ...&channel_binding=disable.

Password auth failed → Re-check user/pass; URL-encode special characters (@ → %40, & → %26, etc.).

psql not found → Install the PostgreSQL client (see Prerequisites).

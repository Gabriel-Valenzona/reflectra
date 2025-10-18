Reflectra — Mood-driven productivity app (Django + React + Neon PostgreSQL).
This guide gets you from a fresh machine to a local app running end-to-end, with step-by-step checks and fixes.

0) What we’re building (stack + modules)

Frontend: React + TypeScript (Vite), Tailwind CSS, Zustand (state), React Router, Recharts (charts).

Backend: Django + Django REST Framework (DRF), Simple JSON Web Token (JWT) auth, CORS (Cross-Origin Resource Sharing), drf-spectacular (OpenAPI docs).

Database: Neon (hosted PostgreSQL). All connections use Transport Layer Security (TLS); campus networks may block port 5432.

Core features (MVP):

Mood entries + notes (+ analytics)

Tasks + Goals

Reminders scaffold (email later)

Social follow + lightweight notifications

Daily quote by mood + daily quiz

Optional AI coach (only if key present)

1) Prerequisites (install once)

You need the following tools. Use the checks below to verify and fix.

Tool	Check	Expected	Install / Fix
Python 3.11+ (with pip, venv)	python --version / pip --version (Windows alt: py --version)	Python 3.11+	Windows: python.org installer (check “Add Python to PATH”). macOS: brew install python@3.12. Ubuntu: sudo apt update && sudo apt install -y python3 python3-venv python3-pip.
Git	git --version	2.x	Windows: git-scm.com. macOS: brew install git. Ubuntu: sudo apt install -y git.
Node.js 18+ & npm	node -v / npm -v	Node ≥ 18, npm ≥ 9	nodejs.org (LTS) or brew install node on macOS.
PostgreSQL client (psql)	psql --version	14+	Windows (Chocolatey): choco install postgresql (client included). macOS: brew install libpq && echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zprofile && source ~/.zprofile. Ubuntu: sudo apt install -y postgresql-client.
Visual Studio Code	—	—	code.visualstudio.com + Python extension recommended.

If python runs an old version:

Windows: py -3.12 -m venv .venv (explicitly choose 3.12)

macOS/Linux: install newer Python and call python3.12 directly

2) Clone and create your Virtual Environment (venv)

A Virtual Environment isolates project Python packages.

git clone https://github.com/Gabriel-Valenzona/reflectra.git
cd reflectra


Create & activate venv:

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

3) Backend dependencies (Django + REST + PostgreSQL)

With (.venv) active:

python -m pip install --upgrade pip
pip install Django==5.1.1 djangorestframework==3.15.2 \
  django-cors-headers==4.4.0 drf-spectacular==0.27.2 \
  'psycopg[binary]==3.2.1' django-environ==0.11.2 \
  djangorestframework-simplejwt==5.3.1


Why these:

psycopg[binary]: PostgreSQL driver (prebuilt, no compiler needed).

django-environ: load secrets from .env.

DRF / Simple JWT / CORS / Spectacular: production-leaning API scaffolding.

If install fails:

Ensure quotes around 'psycopg[binary]==3.2.1' on shells that expand brackets.

Upgrade pip: python -m pip install --upgrade pip setuptools wheel.

4) Configure your environment variables

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


Security: Don’t commit .env. If a real password ever leaks, rotate it in Neon and update this file.

5) Verify database connectivity (critical)

Test with psql (works even before Django):

psql "<paste your DATABASE_URL here>" -c "\conninfo"


✅ Expected (success): A table showing

Database, Client User, Host, Server Port: 5432

SSL Protocol: TLSv1.3, SSL Cipher: TLS_AES_256_GCM_SHA384

🧯 If it fails:

Campus Wi-Fi blocks 5432 → Use personal hotspot (recommended).
Or use a VPN with split tunneling (exclude psql.exe so DB traffic bypasses the VPN).

Using VPN and get “server closed the connection unexpectedly” →
dev-only workaround: change the URL to ...&channel_binding=disable.

Password auth failed → Re-check user/pass; URL-encode any special characters (@ → %40, & → %26, etc.).

psql not found → Install the PostgreSQL client (see Prerequisites).

6) Run the backend (Django)

If the repo already contains a Django project named backend and a core app, just migrate and run.
If it does not, see the “If starting fresh” appendix at the end.

From the repo root (with (.venv) active):

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


✅ Expected:
Starting development server at http://127.0.0.1:8000/

Open these in your browser:

Health check: http://127.0.0.1:8000/api/health/ → {"ok": true, "service": "reflectra-backend"}

API docs: http://127.0.0.1:8000/api/docs/ (Swagger UI)

OpenAPI JSON: http://127.0.0.1:8000/api/schema/

Auth endpoints (if present):

POST /api/auth/register/ → {username,email,password}

POST /api/auth/login/ → returns {access, refresh}

GET /api/me/ with Authorization: Bearer <access_token>

🧯 If errors on migrate:

Ensure psql "\conninfo" works first (Step 5).

Confirm .env is present and DATABASE_URL is correct.

If the port is in use, run a different port: python manage.py runserver 8001.

7) Frontend setup (React + TypeScript via Vite)

Skip this section if the frontend/ folder already exists with dependencies installed.

Create the app:

# from repo root
npm create vite@latest frontend -- --template react-ts
cd frontend
npm i
npm i axios react-router-dom zustand recharts
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Tailwind configuration:

In tailwind.config.js, set:

content: ["./index.html", "./src/**/*.{ts,tsx}"]


In src/index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;


Create frontend/.env:

VITE_API_URL=http://127.0.0.1:8000/api


Axios client (example) src/lib/api.ts:

import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});


Run dev server:

npm run dev


🧯 If the browser console shows CORS errors:
Add your frontend origin to backend .env → CORS_ALLOWED_ORIGINS=http://localhost:5173, then restart runserver.

8) “Am I caught up?” checklist

 psql "\conninfo" succeeds (TLS shown).

 python manage.py migrate runs cleanly.

 http://127.0.0.1:8000/api/health/ returns {"ok": true, ...}.

 API docs load at /api/docs/.

 Can register, login, and call /api/me with a Bearer token.

 Frontend builds (npm run dev) and can call the backend (no CORS errors).

9) Common problems → Fast fixes

ModuleNotFoundError: No module named 'django'
You’re outside the venv. Activate it and reinstall dependencies.

PowerShell won’t activate venv
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

Neon connection fails on campus Wi-Fi
Use hotspot or VPN split tunneling for DB traffic.
Dev-only: set channel_binding=disable in the DATABASE_URL.

pip install fails compiling packages
Ensure you used 'psycopg[binary]'. Upgrade pip/setuptools/wheel.

Port already in use
python manage.py runserver 8001

CORS errors
Add the frontend origin to CORS_ALLOWED_ORIGINS in backend .env, restart.

10) Optional but recommended (quality tools)

.gitignore (keep secrets and build artifacts out of Git):

.venv/
__pycache__/
*.pyc
staticfiles/
media/
.env
node_modules/
dist/


Pre-commit hooks (format/lint on commit):

pip install black isort flake8 pre-commit


.pre-commit-config.yaml:

repos:
  - repo: https://github.com/psf/black
    rev: 24.8.0
    hooks: [{ id: black }]
  - repo: https://github.com/PyCQA/isort
    rev: 5.13.2
    hooks: [{ id: isort }]
  - repo: https://github.com/PyCQA/flake8
    rev: 7.1.1
    hooks: [{ id: flake8 }]


Then:

pre-commit install

11) Deployment (preview)

Database: Neon (already set).

Backend: Render or Railway
Env vars: DATABASE_URL, SECRET_KEY, ALLOWED_HOSTS=<backend-host>,localhost, CORS_ALLOWED_ORIGINS=<frontend-url>

Frontend: Vercel
Env var: VITE_API_URL=https://<backend-host>/api

12) Glossary (acronyms expanded once)

API — Application Programming Interface

CORS — Cross-Origin Resource Sharing

DRF — Django REST Framework

JWT — JSON Web Token

ORM — Object-Relational Mapper (Django’s database layer)

TLS — Transport Layer Security (encryption on the wire)

Appendix A — If starting fresh (no backend yet)

Only do this if the repo does not include a Django project:

# with (.venv) active and deps from Step 3 installed
django-admin startproject backend .
python manage.py startapp core


Edit backend/settings.py to load .env, enable apps and middleware:

from pathlib import Path
import environ, os

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

DEBUG = env.bool("DEBUG", default=False)
SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = [h.strip() for h in env("ALLOWED_HOSTS", default="localhost").split(",")]

INSTALLED_APPS = [
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
    "rest_framework","corsheaders","drf_spectacular",
    "core",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
CORS_ALLOWED_ORIGINS = [o.strip() for o in env("CORS_ALLOWED_ORIGINS", default="").split(",") if o]
DATABASES = { "default": env.db("DATABASE_URL") }
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
SPECTACULAR_SETTINGS = { "TITLE": "Reflectra API", "VERSION": "0.1.0" }
TIME_ZONE = "UTC"; USE_TZ = True
STATIC_URL = "static/"


Routes:

backend/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/", include("core.urls")),
]


core/urls.py

from django.urls import path
from . import views

urlpatterns = [ path("health/", views.health, name="health") ]


core/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"ok": True, "service": "reflectra-backend"})


Then migrate & run:

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

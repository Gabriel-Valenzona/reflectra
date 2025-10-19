"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see:
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

# ✅ This tells Django which settings file to use
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# ✅ This creates the WSGI application that servers like Gunicorn or Django’s dev server use
application = get_wsgi_application()

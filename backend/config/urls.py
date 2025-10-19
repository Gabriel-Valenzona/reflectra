# ===========================================
# File: config/urls.py
# Description: Root URL configuration for Reflectra backend
# ===========================================

"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# ✅ Simple root route to confirm backend is running
def home(request):
    return JsonResponse({
        "status": "ok",
        "message": "Reflectra backend is live 🚀",
        "api_base": "/api/"
    })

urlpatterns = [
    path('', home),  # ✅ Base health check
    path('admin/', admin.site.urls),
    path('api/', include('reflectra.urls')),  # ✅ Include all reflectra routes
]
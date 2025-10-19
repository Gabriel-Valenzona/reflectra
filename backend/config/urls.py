"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse  # 👈 add this import

# 👇 simple root route to confirm the backend is working
def home(request):
    return JsonResponse({
        "status": "ok",
        "message": "Reflectra backend is live 🚀",
        "api_base": "/api/"
    })

urlpatterns = [
    path('', home),  # 👈 add this line
    path('admin/', admin.site.urls),
    path('api/', include('reflectra.urls')),  # ✅ your app’s API routes
]

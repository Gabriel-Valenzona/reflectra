"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views.
https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# simple root route to confirm backend is running
def home(request):
    return JsonResponse({
        "status": "ok",
        "message": "Reflectra backend is live 🚀",
        "api_base": "/api/"
    })

urlpatterns = [
    path('', home),  # base health check
    path('admin/', admin.site.urls),
    path('api/', include('reflectra.urls')),  # include all reflectra routes
]
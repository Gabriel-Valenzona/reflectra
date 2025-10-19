# ===========================================
# File: reflectra/urls.py
# Description: Routes for Reflectra API endpoints
# ===========================================

from django.urls import path
from . import views_auth

urlpatterns = [
    # ✅ User registration & login
    path('register/', views_auth.register_user, name='register_user'),
    path('login/', views_auth.login_user, name='login_user'),

    # ✅ Get current logged-in user info
    path('userinfo/', views_auth.get_user_info, name='userinfo'),

    # ✅ Update user account info (bio, mood, email, etc.)
    path('update_user_info/', views_auth.update_user_info, name='update_user_info'),
]
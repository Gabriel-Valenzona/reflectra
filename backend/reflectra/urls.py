# ===========================================
# File: reflectra/urls.py
# Description: Routes for Reflectra API endpoints
# ===========================================

from django.urls import path
from . import views, views_auth

urlpatterns = [
    # ✅ User registration & login
    path('register/', views_auth.register_user, name='register_user'),
    path('login/', views_auth.login_user, name='login_user'),

    # ✅ Account management
    path('userinfo/', views_auth.get_user_info, name='userinfo'),
    path('update_user_info/', views_auth.update_user_info, name='update_user_info'),
    path('delete_account/', views_auth.delete_user_account, name='delete_user_account'),

    # ✅ Find and follow system
    path('find_users/', views.list_users, name='find_users'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/', views.unfollow_user, name='unfollow_user'),
    path('followers/<int:user_id>/', views.get_followers, name='get_followers'),
]
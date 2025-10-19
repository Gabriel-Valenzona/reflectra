# ===========================================
# File: reflectra/urls.py
# Description: Routes for Reflectra API endpoints
# ===========================================

from django.urls import path
from . import views, views_auth, views_posts

urlpatterns = [
    # ✅ User registration & login
    path('register/', views_auth.register_user, name='register_user'),
    path('login/', views_auth.login_user, name='login_user'),

    # ✅ Account management
    path('userinfo/', views_auth.get_user_info, name='userinfo'),
    path('update_user_info/', views_auth.update_user_info, name='update_user_info'),
    path('delete_account/', views_auth.delete_user_account, name='delete_user_account'),
    path('posts/<int:post_id>/', views_posts.delete_post, name='delete_post'),

    # ✅ Follow system & search
    path('find_users/', views.list_users, name='find_users'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/', views.unfollow_user, name='unfollow_user'),
    path('followers/<int:user_id>/', views.get_followers, name='get_followers'),

    # ✅ New endpoints for Activity Feed
    path('me/', views_auth.get_me, name='get_me'),
    path('following/', views.get_following, name='get_following'),  # ✅ fixed reference
    path('posts/', views_posts.list_create_posts, name='list_create_posts'),
]
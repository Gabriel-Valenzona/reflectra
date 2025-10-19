from django.urls import path
from . import views_auth

urlpatterns = [
    path('register/', views_auth.register_user, name='register_user'),
    path('login/', views_auth.login_user, name='login_user'),
    path('userinfo/', views_auth.get_user_info, name='userinfo'),  # ✅ new route
]
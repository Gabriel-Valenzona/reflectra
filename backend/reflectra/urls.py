from django.urls import path
from .views_auth import register_user, login_user

urlpatterns = [
    path('api/register/', register_user, name='register_user'),
    path('api/login/', login_user, name='login_user'),
]

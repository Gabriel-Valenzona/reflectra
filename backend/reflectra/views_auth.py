# reflectra/views_auth.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import logging

# Set up logging
logger = logging.getLogger(__name__)

# -------------------------------
# REGISTER USER
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not all([username, email, password]):
        return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)

    # Log the event
    log_message = f"✅ User created; username = {username}, email = {email}, password = {password}"
    logger.info(log_message)
    print(log_message)

    return Response(
        {'message': f'User \"{username}\" created successfully'},
        status=status.HTTP_201_CREATED
    )


# -------------------------------
# LOGIN USER (Username OR Email)
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    login_input = request.data.get('username')  # can be username OR email
    password = request.data.get('password')

    if not all([login_input, password]):
        return Response({'error': 'Both username/email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Determine if input is email or username
    try:
        if '@' in login_input:
            user_obj = User.objects.get(email=login_input)
            username = user_obj.username
        else:
            username = login_input
    except User.DoesNotExist:
        return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    # Authenticate with the resolved username
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    log_message = f"🔐 User logged in; username = {user.username}, email = {user.email}"
    logger.info(log_message)
    print(log_message)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user.username,
    })
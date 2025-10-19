from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import logging

# Set up basic logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate required fields
    if not all([username, email, password]):
        return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if username exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)

    # Log and print event
    log_message = f"✅ User created; username = {username}, password = {password}"
    logger.info(log_message)
    print(log_message)

    return Response(
        {'message': f'User "{username}" created successfully'},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    log_message = f"🔐 User logged in; username = {user.username}"
    logger.info(log_message)
    print(log_message)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user.username,
    })
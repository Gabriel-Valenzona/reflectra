# ===========================================
# File: reflectra/views_auth.py
# Description: Authentication and user info management (with user ID logging)
# ===========================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from .models import UserProfile

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

    # Create Django user
    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user)

    log_message = f"✅ User registered | user_id={user.id}, username={username}, email={email}"
    logger.info(log_message)
    print(log_message)

    return Response({'message': f'User \"{username}\" created successfully'}, status=status.HTTP_201_CREATED)


# -------------------------------
# LOGIN USER (Username OR Email)
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    login_input = request.data.get('username')
    password = request.data.get('password')

    if not all([login_input, password]):
        return Response({'error': 'Both username/email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if '@' in login_input:
            user_obj = User.objects.get(email=login_input)
            username = user_obj.username
        else:
            username = login_input
    except User.DoesNotExist:
        return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    log_message = f"🔐 User logged in | user_id={user.id}, username={user.username}, email={user.email}"
    logger.info(log_message)
    print(log_message)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user.username,
    })


# -------------------------------
# GET USER INFO
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    profile = getattr(user, 'profile', None)

    log_message = f"📄 User info fetched | user_id={user.id}, username={user.username}, email={user.email}"
    logger.info(log_message)
    print(log_message)

    return Response({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'bio': getattr(profile, 'bio', ''),
        'mood_preference': getattr(profile, 'mood_preference', '')
    })


# -------------------------------
# UPDATE USER INFO
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_info(request):
    user = request.user
    profile = getattr(user, 'profile', None)

    new_name = request.data.get('name')
    new_email = request.data.get('email')
    new_bio = request.data.get('bio', '')
    new_mood = request.data.get('mood', '')

    if not new_name or not new_email:
        return Response({'error': 'Name and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

    old_name = user.username
    old_email = user.email

    user.username = new_name
    user.email = new_email
    user.save()

    if profile:
        profile.bio = new_bio
        profile.mood_preference = new_mood
        profile.save()
    else:
        UserProfile.objects.create(user=user, bio=new_bio, mood_preference=new_mood)

    log_message = (
        f"📝 User profile updated | user_id={user.id}\n"
        f"   - Username: '{old_name}' → '{new_name}'\n"
        f"   - Email: '{old_email}' → '{new_email}'\n"
        f"   - Bio: '{new_bio}'\n"
        f"   - Mood: '{new_mood}'"
    )
    logger.info(log_message)
    print(log_message)

    return Response({'message': 'Profile updated successfully.'}, status=status.HTTP_200_OK)


# -------------------------------
# DELETE USER ACCOUNT
# -------------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_account(request):
    user = request.user
    username = user.username
    email = user.email
    user_id = user.id

    try:
        profile = getattr(user, 'profile', None)
        if profile:
            profile.delete()

        user.delete()

        log_message = f"🗑️ User account deleted | user_id={user_id}, username={username}, email={email}"
        logger.info(log_message)
        print(log_message)

        return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"❌ Failed to delete account | user_id={user_id}, username={username} | Error: {e}")
        return Response({'error': 'Failed to delete account.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# ===========================================
# File: reflectra/views.py
# Description: Views for user search, follow, unfollow, followers list, and following list
# ===========================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Follow, UserProfile
import logging

logger = logging.getLogger(__name__)

# -------------------------------
# List or Search Users
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    query = request.query_params.get('q', '').strip().lower()
    users = User.objects.all()

    if query:
        users = users.filter(username__icontains=query) | users.filter(email__icontains=query)

    result = []
    for user in users:
        profile = getattr(user, 'profile', None)
        result.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': getattr(profile, 'bio', '') if profile else ''
        })

    logger.info(f"👥 User list fetched by {request.user.username}")
    return Response(result, status=status.HTTP_200_OK)


# -------------------------------
# Follow a User
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        target_user = User.objects.get(id=user_id)
        if request.user == target_user:
            return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = Follow.objects.get_or_create(follower=request.user, following=target_user)
        if not created:
            return Response({'message': 'Already following this user.'}, status=status.HTTP_200_OK)

        logger.info(f"➕ {request.user.username} (ID {request.user.id}) followed {target_user.username} (ID {target_user.id})")
        return Response({'message': 'Followed successfully.'}, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# -------------------------------
# Unfollow a User
# -------------------------------
@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, user_id):
    try:
        target_user = User.objects.get(id=user_id)
        follow = Follow.objects.filter(follower=request.user, following=target_user).first()
        if not follow:
            return Response({'error': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)

        follow.delete()
        logger.info(f"❌ {request.user.username} (ID {request.user.id}) unfollowed {target_user.username} (ID {target_user.id})")
        return Response({'message': 'Unfollowed successfully.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# -------------------------------
# Get Followers of a User
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request, user_id):
    try:
        target_user = User.objects.get(id=user_id)
        followers = Follow.objects.filter(following=target_user)

        result = [{'username': f.follower.username, 'id': f.follower.id} for f in followers]
        logger.info(f"👀 Followers list fetched for {target_user.username} (ID {target_user.id})")
        return Response(result, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# ===========================================
# GET FOLLOWING (who the current user follows)
# ===========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_following(request):
    user = request.user
    following_qs = Follow.objects.filter(follower=user).select_related('following')
    following_data = []

    for f in following_qs:
        # ✅ Safely handle missing UserProfile objects
        profile = getattr(f.following, 'profile', None)
        following_data.append({
            "id": f.following.id,
            "username": f.following.username,
            "email": f.following.email,
            "bio": getattr(profile, 'bio', '') if profile else '',
            "mood_preference": getattr(profile, 'mood_preference', '') if profile else '',
        })

    logger.info(f"➡️ Following list fetched for {user.username} (ID {user.id})")
    return Response({"following": following_data}, status=status.HTTP_200_OK)
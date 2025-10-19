# ===========================================
# File: reflectra/views_posts.py
# Description: Handles posting and fetching activity feed posts
# ===========================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import AccountabilityPosts, Follow

# ===========================================
# LIST + CREATE POSTS
# ===========================================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_create_posts(request):
    user = request.user

    # -------------------------------
    # POST → Create a new post
    # -------------------------------
    if request.method == 'POST':
        content_text = request.data.get('content_text', '').strip()
        if not content_text:
            return Response({'error': 'Post content cannot be empty.'}, status=400)

        post = AccountabilityPosts.objects.create(
            user=user,
            content_text=content_text,
            visibility='public'
        )

        return Response({
            'id': post.id,
            'user_id': user.id,
            'username': user.username,
            'content_text': post.content_text,
            'timestamp': post.timestamp
        })

    # -------------------------------
    # GET → Fetch posts (self + followed users)
    # -------------------------------
    following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)
    visible_users = list(following_ids) + [user.id]

    posts = AccountabilityPosts.objects.filter(
        user__id__in=visible_users
    ).order_by('-timestamp')

    serialized = [
        {
            'id': p.id,
            'user_id': p.user.id,
            'username': p.user.username,
            'content_text': p.content_text,
            'timestamp': p.timestamp
        }
        for p in posts
    ]

    return Response(serialized)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    user = request.user
    try:
        post = AccountabilityPosts.objects.get(id=post_id, user=user)
        post.delete()
        return Response({'message': 'Post deleted successfully.'})
    except AccountabilityPosts.DoesNotExist:
        return Response({'error': 'Post not found or unauthorized.'}, status=404)
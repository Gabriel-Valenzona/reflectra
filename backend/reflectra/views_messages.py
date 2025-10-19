# ===========================================
# File: views_messages.py
# Description: Handles sending and fetching user messages
# ===========================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Send a message from the logged-in user to another user."""
    sender = request.user
    receiver_username = request.data.get('receiver')
    content = request.data.get('content')

    # Validate input
    if not receiver_username or not content:
        return Response(
            {"error": "Both receiver and content are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validate receiver
    try:
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({'error': 'Receiver not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create message
    message = Message.objects.create(sender=sender, receiver=receiver, content=content)
    return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation(request, username):
    """Fetch all messages between logged-in user and another user."""
    user = request.user
    try:
        other_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get messages between both users
    messages = Message.objects.filter(
        sender__in=[user, other_user],
        receiver__in=[user, other_user]
    ).order_by('timestamp')

    # Mark messages sent TO the current user as read
    Message.objects.filter(sender=other_user, receiver=user, is_read=False).update(is_read=True)

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inbox(request):
    """Fetch the latest message from each conversation."""
    user = request.user
    conversations = {}

    # Get all messages involving the user, ordered by latest first
    all_messages = Message.objects.filter(sender=user).union(
        Message.objects.filter(receiver=user)
    ).order_by('-timestamp')

    # Keep only the latest message per conversation
    for msg in all_messages:
        partner = msg.receiver if msg.sender == user else msg.sender
        if partner.username not in conversations:
            conversations[partner.username] = msg

    serializer = MessageSerializer(conversations.values(), many=True)
    return Response(serializer.data)
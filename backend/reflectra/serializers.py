# ===========================================
# File: reflectra/serializers.py
# Description: Serializers for Reflectra models
# ===========================================

from rest_framework import serializers
from .models import AccountabilityPosts, UserProfile, MoodLog

# -------------------------------
# User Profile Serializer
# -------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'mood_preference']


# -------------------------------
# Accountability Post Serializer
# -------------------------------
class AccountabilityPostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AccountabilityPosts
        fields = ['id', 'user', 'username', 'content_text', 'timestamp', 'visibility']
        read_only_fields = ['user', 'timestamp']


# -------------------------------
# Mood Log Serializer
# -------------------------------
class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = ['id', 'user', 'mood', 'stress', 'sleep', 'notes', 'timestamp']
        read_only_fields = ['user', 'timestamp']
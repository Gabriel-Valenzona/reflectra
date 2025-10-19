# ===========================================
# File: reflectra/views_wellness.py
# Description: Handles mood & wellness tracking (logs)
# ===========================================

from rest_framework import generics, permissions
from .models import MoodLog
from .serializers import MoodLogSerializer

# -------------------------------
# List & Create Mood Logs
# -------------------------------
class MoodLogListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MoodLog.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
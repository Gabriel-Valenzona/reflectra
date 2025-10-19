# ===========================================
# File: reflectra/models.py
# Description: Defines user profile, follow relationships, posts, and wellness tracking
# ===========================================

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# -------------------------------
# Mood Options for User Profiles
# -------------------------------
MOOD_CHOICES = [
    ('happy', 'Happy'),
    ('sad', 'Sad'),
    ('angry', 'Angry'),
    ('tired', 'Tired'),
    ('confused', 'Confused'),
    ('chill', 'Chill'),
    ('anxious', 'Anxious'),
    ('stressed', 'Stressed'),
    ('motivated', 'Motivated'),
    ('grateful', 'Grateful'),
    ('bored', 'Bored'),
    ('excited', 'Excited'),
    ('lonely', 'Lonely'),
    ('calm', 'Calm'),
    ('overwhelmed', 'Overwhelmed'),
    ('content', 'Content'),
    ('focused', 'Focused'),
    ('neutral', 'Neutral'),
]

# -------------------------------
# UserProfile Model
# -------------------------------
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, null=True)
    mood_preference = models.CharField(max_length=50, choices=MOOD_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


# ✅ Automatically create or update profile when a user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, "profile"):
        instance.profile.save()


# -------------------------------
# Follow Relationship Model
# -------------------------------
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_set")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers_set")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"


# -------------------------------
# Accountability / Activity Posts
# -------------------------------
class AccountabilityPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(
        max_length=10,
        choices=[('public', 'Public'), ('private', 'Private')],
        default='public'
    )

    def __str__(self):
        return f"Post by {self.user.username} at {self.timestamp}"


# -------------------------------
# Wellness / Mood Tracking
# -------------------------------
class MoodLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_logs")
    mood = models.IntegerField()  # 1–10 scale
    stress = models.IntegerField()  # 1–10 scale
    sleep = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Mood {self.mood}, Stress {self.stress}"
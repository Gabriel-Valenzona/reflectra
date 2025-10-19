from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from reflectra.models import MoodLog

User = get_user_model()

class WellnessViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.alice = User.objects.create_user(username="alice", email="alice@example.com", password="Pass1234!")
        self.bob = User.objects.create_user(username="bob", email="bob@example.com", password="Pass1234!")
        self.client.force_authenticate(user=self.alice)

    def test_moodlogs_requires_auth(self):
        self.client.force_authenticate(user=None)
        url = reverse("moodlogs")
        resp = self.client.get(url)
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_list_returns_only_own_logs(self):
        # create logs for both users directly via the model
        MoodLog.objects.create(user=self.alice, mood="happy", notes="sunny")
        MoodLog.objects.create(user=self.bob, mood="sad", notes="rainy")

        url = reverse("moodlogs")
        self.client.force_authenticate(user=self.alice)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        moods = [row.get("mood") for row in resp.data]
        self.assertIn("happy", moods)
        self.assertNotIn("sad", moods)

    def test_create_log_sets_user_implicitly(self):
        url = reverse("moodlogs")
        payload = {"mood": "calm", "notes": "breathing exercise"}  # adjust fields if your serializer differs
        resp = self.client.post(url, payload, format="json")
        # Accept 200 or 201 depending on serializer create
        self.assertIn(resp.status_code, (status.HTTP_200_OK, status.HTTP_201_CREATED))
        self.assertTrue(MoodLog.objects.filter(user=self.alice, mood="calm").exists())

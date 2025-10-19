from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from reflectra.models import UserProfile, Follow

User = get_user_model()

class AuthViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # base users
        self.alice = User.objects.create_user(username="alice", email="alice@example.com", password="Pass1234!")
        self.bob = User.objects.create_user(username="bob", email="bob@example.com", password="Pass1234!")
        # ensure profile related_name='profile' exists
        UserProfile.objects.create(user=self.alice, bio="", mood_preference="")
        UserProfile.objects.create(user=self.bob, bio="", mood_preference="")

    # -------- register --------
    def test_register_user_success(self):
        url = reverse("register_user")
        payload = {"username": "carol", "email": "carol@example.com", "password": "StrongPass!9"}
        resp = self.client.post(url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="carol").exists())
        # profile created
        new_user = User.objects.get(username="carol")
        self.assertTrue(UserProfile.objects.filter(user=new_user).exists())

    def test_register_user_missing_fields(self):
        url = reverse("register_user")
        resp = self.client.post(url, {"username": "x"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", resp.data)

    def test_register_user_duplicate_username(self):
        url = reverse("register_user")
        resp = self.client.post(url, {"username": "alice", "email": "a2@example.com", "password": "x"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_duplicate_email(self):
        url = reverse("register_user")
        resp = self.client.post(url, {"username": "alice2", "email": "alice@example.com", "password": "x"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # -------- login --------
    def test_login_with_username_success(self):
        url = reverse("login_user")
        resp = self.client.post(url, {"username": "alice", "password": "Pass1234!"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data.get("user"), "alice")

    def test_login_with_email_success(self):
        url = reverse("login_user")
        resp = self.client.post(url, {"username": "alice@example.com", "password": "Pass1234!"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)

    def test_login_missing_fields(self):
        url = reverse("login_user")
        resp = self.client.post(url, {"username": "alice"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_wrong_password(self):
        url = reverse("login_user")
        resp = self.client.post(url, {"username": "alice", "password": "wrong"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------- userinfo (auth required) --------
    def test_get_user_info_ok(self):
        url = reverse("userinfo")
        self.client.force_authenticate(user=self.alice)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["username"], "alice")
        self.client.force_authenticate(user=None)

    # -------- update_user_info --------
    def test_update_user_info_ok(self):
        url = reverse("update_user_info")
        self.client.force_authenticate(user=self.alice)
        payload = {"name": "alice_new", "email": "alice_new@example.com", "bio": "hi", "mood": "calm"}
        resp = self.client.put(url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.alice.refresh_from_db()
        self.assertEqual(self.alice.username, "alice_new")
        self.assertEqual(self.alice.email, "alice_new@example.com")
        self.assertEqual(self.alice.profile.bio, "hi")
        self.assertEqual(self.alice.profile.mood_preference, "calm")
        self.client.force_authenticate(user=None)

    def test_update_user_info_missing_fields(self):
        url = reverse("update_user_info")
        self.client.force_authenticate(user=self.alice)
        resp = self.client.put(url, {"name": ""}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.client.force_authenticate(user=None)

    # -------- delete_user_account --------
    def test_delete_user_account_ok(self):
        url = reverse("delete_user_account")
        self.client.force_authenticate(user=self.bob)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(username="bob").exists())
        self.client.force_authenticate(user=None)

    # -------- get_me --------
    def test_get_me_ok(self):
        url = reverse("get_me")
        self.client.force_authenticate(user=self.alice)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["username"], "alice")
        self.client.force_authenticate(user=None)

    # -------- get_following --------
    def test_get_following_enriched(self):
        # alice follows bob
        Follow.objects.create(follower=self.alice, following=self.bob)
        url = reverse("get_following")
        self.client.force_authenticate(user=self.alice)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("following", resp.data)
        usernames = {row["username"] for row in resp.data["following"]}
        self.assertIn("bob", usernames)
        # enriched keys exist
        sample = resp.data["following"][0]
        for key in ("id", "username", "email", "bio", "mood_preference"):
            self.assertIn(key, sample)
        self.client.force_authenticate(user=None)


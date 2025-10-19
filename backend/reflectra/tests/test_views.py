from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from reflectra.models import Follow, UserProfile

User = get_user_model()


class SocialViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.alice = User.objects.create_user(
            username="alice", email="alice@example.com", password="Pass1234!"
        )
        self.bob = User.objects.create_user(
            username="bob", email="bob@example.com", password="Pass1234!"
        )
        self.carol = User.objects.create_user(
            username="carol", email="carol@example.com", password="Pass1234!"
        )

        # Optional profiles so bio/mood fields exist
        UserProfile.objects.create(user=self.alice, bio="hi i'm alice", mood_preference="calm")
        UserProfile.objects.create(user=self.bob, bio="bob here", mood_preference="focused")
        UserProfile.objects.create(user=self.carol, bio="", mood_preference="")

        # Authenticate as Alice for these tests
        self.client.force_authenticate(user=self.alice)

    # -------------------------------
    # list_users
    # -------------------------------
    def test_list_users_no_query_returns_all(self):
        url = reverse("find_users")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        usernames = {u["username"] for u in resp.data}
        self.assertTrue({"alice", "bob", "carol"}.issubset(usernames))

        # Each item shape
        sample = resp.data[0]
        self.assertIn("id", sample)
        self.assertIn("username", sample)
        self.assertIn("email", sample)
        self.assertIn("bio", sample)

    def test_list_users_filters_by_q_username_or_email(self):
        url = reverse("find_users")

        # by username (icontains)
        resp1 = self.client.get(url, {"q": "ali"})
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        self.assertEqual({row["username"] for row in resp1.data}, {"alice"})

        # by email (icontains)
        resp2 = self.client.get(url, {"q": "bob@"})
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual({row["username"] for row in resp2.data}, {"bob"})

    # -------------------------------
    # follow_user
    # -------------------------------
    def test_follow_user_success_and_idempotent(self):
        url = reverse("follow_user", args=[self.bob.id])

        # First time → created (201)
        resp1 = self.client.post(url, {}, format="json")
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Follow.objects.filter(follower=self.alice, following=self.bob).exists())

        # Second time → already following (200)
        resp2 = self.client.post(url, {}, format="json")
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)

    def test_follow_user_cannot_follow_self(self):
        url = reverse("follow_user", args=[self.alice.id])
        resp = self.client.post(url, {}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", resp.data)

    def test_follow_user_target_not_found(self):
        url = reverse("follow_user", args=[999999])
        resp = self.client.post(url, {}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # -------------------------------
    # unfollow_user
    # -------------------------------
    def test_unfollow_user_success(self):
        Follow.objects.create(follower=self.alice, following=self.bob)
        url = reverse("unfollow_user", args=[self.bob.id])

        # You allow DELETE or POST — test DELETE path
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(Follow.objects.filter(follower=self.alice, following=self.bob).exists())

    def test_unfollow_user_when_not_following(self):
        url = reverse("unfollow_user", args=[self.bob.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", resp.data)

    def test_unfollow_user_target_not_found(self):
        url = reverse("unfollow_user", args=[987654])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # -------------------------------
    # get_followers
    # -------------------------------
    def test_get_followers_lists_user_followers(self):
        # Carol and Bob follow Alice
        Follow.objects.create(follower=self.bob, following=self.alice)
        Follow.objects.create(follower=self.carol, following=self.alice)

        url = reverse("get_followers", args=[self.alice.id])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        followers = {row["username"] for row in resp.data}
        self.assertSetEqual(followers, {"bob", "carol"})

    def test_get_followers_user_not_found(self):
        url = reverse("get_followers", args=[777777])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # -------------------------------
    # get_following (enriched shape)
    # -------------------------------
    def test_get_following_returns_enriched_follow_list(self):
        # Alice follows Bob and Carol
        Follow.objects.create(follower=self.alice, following=self.bob)
        Follow.objects.create(follower=self.alice, following=self.carol)

        url = reverse("get_following")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        self.assertIn("following", resp.data)
        following = resp.data["following"]
        usernames = {row["username"] for row in following}
        self.assertSetEqual(usernames, {"bob", "carol"})

        # Enriched fields present (bio/mood may be empty but keys should exist)
        sample = following[0]
        for key in ("id", "username", "email", "bio", "mood_preference"):
            self.assertIn(key, sample)

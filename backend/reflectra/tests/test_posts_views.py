from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from reflectra.models import AccountabilityPosts, Follow

User = get_user_model()

class PostsViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.alice = User.objects.create_user(username="alice", email="alice@example.com", password="Pass1234!")
        self.bob = User.objects.create_user(username="bob", email="bob@example.com", password="Pass1234!")
        self.client.force_authenticate(user=self.alice)

    def test_create_post_success(self):
        url = reverse("list_create_posts")
        resp = self.client.post(url, {"content_text": "Hello world"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(AccountabilityPosts.objects.filter(user=self.alice, content_text="Hello world").exists())

    def test_create_post_rejects_empty(self):
        url = reverse("list_create_posts")
        resp = self.client.post(url, {"content_text": "   "}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_posts_includes_self_and_followed(self):
        # Alice follows Bob
        Follow.objects.create(follower=self.alice, following=self.bob)
        # Bob's and Alice's posts
        p1 = AccountabilityPosts.objects.create(user=self.bob, content_text="Bob post", visibility="public")
        p2 = AccountabilityPosts.objects.create(user=self.alice, content_text="Alice post", visibility="public")

        url = reverse("list_create_posts")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        bodies = [item["content_text"] for item in resp.data]
        self.assertIn("Bob post", bodies)
        self.assertIn("Alice post", bodies)
        # Not include random user's posts
        charlie = User.objects.create_user(username="charlie", email="charlie@example.com", password="Pass1234!")
        AccountabilityPosts.objects.create(user=charlie, content_text="Charlie's post", visibility="public")
        resp2 = self.client.get(url)
        bodies2 = [item["content_text"] for item in resp2.data]
        self.assertNotIn("Charlie's post", bodies2)

    def test_delete_own_post(self):
        post = AccountabilityPosts.objects.create(user=self.alice, content_text="to delete", visibility="public")
        url = reverse("delete_post", args=[post.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(AccountabilityPosts.objects.filter(id=post.id).exists())

    def test_delete_others_post_fails(self):
        post = AccountabilityPosts.objects.create(user=self.bob, content_text="bob post", visibility="public")
        url = reverse("delete_post", args=[post.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from reflectra.models import Message

User = get_user_model()

class MessagesViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.alice = User.objects.create_user(username="alice", email="alice@example.com", password="Pass1234!")
        self.bob = User.objects.create_user(username="bob", email="bob@example.com", password="Pass1234!")
        self.client.force_authenticate(user=self.alice)

    def test_send_message_success(self):
        url = reverse("send_message")
        payload = {"receiver": "bob", "content": "Hello Bob!"}
        resp = self.client.post(url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["content"], "Hello Bob!")
        self.assertEqual(resp.data["receiver"], "bob")

    def test_send_message_missing_fields(self):
        url = reverse("send_message")
        resp = self.client.post(url, {"receiver": "bob"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_conversation_marks_read_and_returns_history(self):
        # Create messages (some unread for alice)
        Message.objects.create(sender=self.alice, receiver=self.bob, content="A1")
        Message.objects.create(sender=self.bob, receiver=self.alice, content="B1", is_read=False)
        Message.objects.create(sender=self.alice, receiver=self.bob, content="A2")
        Message.objects.create(sender=self.bob, receiver=self.alice, content="B2", is_read=False)

        url = reverse("get_conversation", args=["bob"])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Sorted ascending by timestamp in the view
        texts = [m["content"] for m in resp.data]
        self.assertEqual(texts, ["A1", "B1", "A2", "B2"])

        # After fetch, messages from bob -> alice should be marked read
        self.assertFalse(Message.objects.filter(sender=self.bob, receiver=self.alice, is_read=False).exists())

    def test_inbox_returns_latest_per_partner(self):
        # Conversations with bob and a second user carol
        carol = User.objects.create_user(username="carol", email="carol@example.com", password="Pass1234!")

        # Older messages
        Message.objects.create(sender=self.alice, receiver=self.bob, content="old to bob")
        Message.objects.create(sender=self.alice, receiver=carol, content="old to carol")

        # Latest messages (should be the ones returned)
        Message.objects.create(sender=self.bob, receiver=self.alice, content="latest from bob")
        Message.objects.create(sender=carol, receiver=self.alice, content="latest from carol")

        url = reverse("inbox")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # We should get one item per partner: bob and carol
        partners = {item["sender"] if item["sender"] != "alice" else item["receiver"] for item in resp.data}
        self.assertSetEqual(partners, {"bob", "carol"})

        contents = [item["content"] for item in resp.data]
        self.assertIn("latest from bob", contents)
        self.assertIn("latest from carol", contents)

from django.test import SimpleTestCase
from django.urls import reverse, resolve

class UrlsResolveTests(SimpleTestCase):
    """Ensure each named route exists and resolves cleanly."""

    def test_auth_routes(self):
        self.assertEqual(resolve(reverse("register_user")).view_name, "register_user")
        self.assertEqual(resolve(reverse("login_user")).view_name, "login_user")
        self.assertEqual(resolve(reverse("userinfo")).view_name, "userinfo")
        self.assertEqual(resolve(reverse("update_user_info")).view_name, "update_user_info")
        self.assertEqual(resolve(reverse("delete_user_account")).view_name, "delete_user_account")
        self.assertEqual(resolve(reverse("get_me")).view_name, "get_me")
        self.assertEqual(resolve(reverse("get_following")).view_name, "get_following")

    def test_posts_routes(self):
        self.assertEqual(resolve(reverse("list_create_posts")).view_name, "list_create_posts")
        # Route with path converter
        self.assertEqual(
            resolve(reverse("delete_post", args=[123])).view_name,
            "delete_post",
        )

    def test_follow_and_search_routes(self):
        self.assertEqual(resolve(reverse("find_users")).view_name, "find_users")
        self.assertEqual(resolve(reverse("follow_user", args=[1])).view_name, "follow_user")
        self.assertEqual(resolve(reverse("unfollow_user", args=[1])).view_name, "unfollow_user")
        self.assertEqual(resolve(reverse("get_followers", args=[1])).view_name, "get_followers")

    def test_messages_routes(self):
        self.assertEqual(resolve(reverse("send_message")).view_name, "send_message")
        self.assertEqual(resolve(reverse("inbox")).view_name, "inbox")
        self.assertEqual(resolve(reverse("get_conversation", args=["alice"])).view_name, "get_conversation")

    def test_wellness_route(self):
        match = resolve(reverse("moodlogs"))
        self.assertEqual(match.view_name, "moodlogs")
        # Optional: check the view class name
        # Func for class-based views is a wrapper; expose view_class when available
        view_class = getattr(match.func, "view_class", None)
        self.assertIsNotNone(view_class)
        self.assertEqual(view_class.__name__, "MoodLogListCreateView")

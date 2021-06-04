import json
from datetime import datetime

from django.contrib.auth.models import User
from django.test import Client
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from comments.models import Comment
from comments.serializers.comment_serializer import CommentSerializer
from issues.models import Issue, OPEN
from repository.models import Repository


# noinspection DuplicatedCode
class CommentTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass", email="test@example.com")

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="testadmin", password="adminpass")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.issue1 = Issue.objects.create(title="Issue 1", description="Issue desc",
                                           due_date=datetime(2021, 5, 15).date(),
                                           weight=3, state=OPEN, type='ISSUE', repository=self.repository)

        self.issue2 = Issue.objects.create(title="Issue 2", description="Issue 2 desc",
                                           due_date=datetime(2021, 5, 15).date(),
                                           weight=3, state=OPEN, type='ISSUE', repository=self.repository)

        self.comment1 = Comment.objects.create(content="Comment 1 test content", postedAt="2021-04-06",
                                               author_id=self.user.id, issue_id=self.issue1.id)

        self.comment2 = Comment.objects.create(content="Comment 2 test content", postedAt="2021-04-06",
                                               author_id=self.user.id, issue_id=self.issue1.id)

        self.comment2 = Comment.objects.create(content="Comment 3 test content", postedAt="2021-04-06",
                                               author_id=self.user.id, issue_id=self.issue2.id)

    def test_get_all_comments(self):
        response = self.client.get(
            reverse("get_all_comments"))

        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_comments_for_issue(self):
        response = self.client.get(
            reverse("get_comments_for_issue", kwargs={'issue_id': self.issue1.id}))

        comments_for_repo = Comment.objects.filter(issue_id=self.issue1.id)
        serializer = CommentSerializer(comments_for_repo, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_comments_for_issue_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")
        response = self.client.get(
            reverse("get_comments_for_issue", kwargs={'issue_id': self.issue1.id}))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_valid_data(self):
        count_before_create = Comment.objects.all().count()

        response = self.client.post(
            reverse("create_comment", kwargs={'issue_id': self.issue1.id}), {
                'author': 'testuser',
                'content': 'Test content create comment',
                'postedAt': '2021-04-06'
            })

        count_after_create = Comment.objects.all().count()
        comment_new = Comment.objects.get(content='Test content create comment')
        serializer = CommentSerializer(comment_new)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(count_after_create, count_before_create + 1)

    def test_create_comment_invalid_data(self):
        response = self.client.post(
            reverse("create_comment", kwargs={'issue_id': self.issue1.id}), {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_author_not_found(self):
        response = self.client.post(
            reverse("create_comment", kwargs={'issue_id': self.issue1.id}), {
                'author': 'testuser2',
                'content': 'Test content create comment',
                'postedAt': '2021-04-06'
            })

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_comment_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")

        response = self.client.post(
            reverse("create_comment", kwargs={'issue_id': self.issue1.id}), {
                'author': 'testuser',
                'content': 'Test content create comment',
                'postedAt': '2021-04-06'
            })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put_comment_valid_data(self):
        comment_content = {
            'content': 'Test content updated comment'
        }

        response = self.client.put(
            reverse("update_comment", kwargs={'comment_id': self.comment1.id}),
            data=json.dumps(comment_content),
            content_type='application/json')

        comment_updated = Comment.objects.get(pk=self.comment1.id)
        serializer = CommentSerializer(comment_updated)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Test content updated comment', serializer.data['content'])

    def test_put_comment_not_found(self):
        comment_content = {
            'content': 'Test content updated comment'
        }

        response = self.client.put(
            reverse("update_comment", kwargs={'comment_id': 99}),
            data=json.dumps(comment_content),
            content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_comment_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")

        comment_content = {
            'content': 'Test content updated comment'
        }

        response = self.client.put(
            reverse("update_comment", kwargs={'comment_id': self.comment1.id}),
            data=json.dumps(comment_content),
            content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_comment_valid(self):
        count_before_delete = Comment.objects.all().count()

        response = self.client.delete(
            reverse("delete_comment", kwargs={'comment_id': self.comment1.id}))

        count_after_delete = Comment.objects.all().count()
        comment_deleted = Comment.objects.filter(content="Comment 1 test content")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count_after_delete, count_before_delete - 1)
        self.assertEqual(comment_deleted.exists(), False)

    def test_delete_comment_not_found(self):
        response = self.client.delete(
            reverse("delete_comment", kwargs={'comment_id': 99}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_comment_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")

        response = self.client.delete(
            reverse("delete_comment", kwargs={'comment_id': self.comment1.id}))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


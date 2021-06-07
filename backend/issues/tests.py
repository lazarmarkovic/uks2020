from datetime import datetime

from django.contrib.auth.models import User
from django.test import Client
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework.utils import json

from issues.models import Issue, OPEN
from issues.serializers.issue_serializers import IssueSerializer
from labels.models import Label
from milestones.models import Milestone
from repository.models import Repository


class TestIssueGet(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="admin", password="admin")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.milestone1 = Milestone.objects.create(name="Milestone1", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2021, 12, 5),
                                                   repository=self.repository)

        self.repository.milestone_set.add(self.milestone1)

        self.issue1 = Issue.objects.create(title="Issue 1", description="Issue desc",
                                           due_date=datetime(2021, 12, 15).date(),
                                           weight=3, state=OPEN, type='ISSUE', repository=self.repository)

        self.issue2 = Issue.objects.create(title="Issue 2", description="Issue desc",
                                           due_date=datetime(2021, 12, 25).date(),
                                           weight=4, state=OPEN, type='ISSUE', repository=self.repository)

    def test_get_all_issues_for_repo(self):
        response = self.client.get(
            reverse('get_all_issues_for_repository', kwargs={'repository_id': self.repository.id}))

        issues = Issue.objects.all()
        serializer = IssueSerializer(issues, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_issues_unauthenticated(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.get(
            reverse('get_all_issues_for_repository', kwargs={'repository_id': self.repository.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_valid_single_issue(self):
        response = self.client.get(
            reverse('get_one_issue', kwargs={'issue_id': self.issue1.id}))
        issue = Issue.objects.get(pk=self.issue1.pk)
        serializer = IssueSerializer(issue)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_not_existing_issue(self):
        response = self.client.get(
            reverse('get_one_issue', kwargs={'issue_id': 3099}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestIssuePost(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="admin", password="admin")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.issue1 = Issue.objects.create(title="Issue 1", description="Issue desc",
                                           due_date=datetime(2021, 12, 15).date(),
                                           weight=3, state=OPEN, type='ISSUE', repository=self.repository)

        self.issue2 = Issue.objects.create(title="Issue 2", description="Issue desc",
                                           due_date=datetime(2021, 12, 25).date(),
                                           weight=4, state=OPEN, type='ISSUE', repository=self.repository)

        self.label_backend = Label.objects.create(name="backend", description="", color="#f51b07",
                                                  repository=self.repository)
        self.label_frontend = Label.objects.create(name="frontend", description="", color="#055cf2",
                                                   repository=self.repository)

    def test_post_request_with_no_data(self):
        response = self.client.post(reverse('create_issue', kwargs={'repository_id': self.repository.id}), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_valid_issue(self):
        count_before_create = Issue.objects.all().count()
        issue = {
            'title': 'New issue',
            'description': 'Issue Description',
            'due_date': '2021-12-25',
            'weight': 4,
            'state': 'OP',
            'labels': [
                {
                    'id': self.label_backend.id,
                    'name': self.label_backend.name,
                    'description': self.label_backend.description,
                    'color': self.label_backend.color
                },
                {
                    'id': self.label_frontend.id,
                    'name': self.label_frontend.name,
                    'description': self.label_frontend.description,
                    'color': self.label_frontend.color
                },
            ],
            'type': 'ISSUE'
        }
        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        issue = Issue.objects.get(title="New issue")
        serializer = IssueSerializer(issue, many=False)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count_before_create + 1, Issue.objects.all().count())
        self.assertEqual(response.data, serializer.data)

    def test_create_issue_invalid_label(self):
        count_before_create = Issue.objects.all().count()
        issue = {
            'title': 'New issue',
            'description': 'Issue Description',
            'due_date': '2021-12-25',
            'weight': 4,
            'state': 'OP',
            'labels': [
                {
                    'id': self.label_backend.id,
                    'name': self.label_backend.name,
                    'description': self.label_backend.description,
                    'color': self.label_backend.color
                },
                {
                    'id': 35678,
                    'name': self.label_frontend.name,
                    'description': self.label_frontend.description,
                    'color': self.label_frontend.color
                },
            ],
            'type': 'ISSUE'
        }
        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(count_before_create, Issue.objects.all().count())

    def test_create_issue_with_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        issue = {
            'title': 'New issue',
            'description': 'Issue Description',
            'due_date': '2021-12-25',
            'weight': 4,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }
        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_issue_repository_not_found(self):
        issue = {
            'title': 'New issue',
            'description': 'Issue Description',
            'due_date': '2021-12-25',
            'weight': 4,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }
        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': 234567}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_milestone_duplicate_name(self):
        issue = {
            'title': self.issue1.title,
            'description': 'Issue Description',
            'due_date': '2021-12-25',
            'weight': 4,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }

        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_issue_invalid_due_date(self):

        count_before_create = Issue.objects.all().count()
        issue = {
            'title': 'New issue',
            'description': 'Issue Description',
            'due_date': '2020-02-15',
            'weight': 4,
            'state': 'OP',
            'labels': [
                {
                    'id': self.label_backend.id,
                    'name': self.label_backend.name,
                    'description': self.label_backend.description,
                    'color': self.label_backend.color
                },
                {
                    'id': self.label_frontend.id,
                    'name': self.label_frontend.name,
                    'description': self.label_frontend.description,
                    'color': self.label_frontend.color
                },
            ],
            'type': 'ISSUE'
        }
        response = self.client.post(
            reverse('create_issue', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(count_before_create, Issue.objects.all().count())


class TestIssuePut(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="admin", password="admin")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.milestone1 = Milestone.objects.create(name="Milestone1", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2021, 8, 5),
                                                   repository=self.repository)

        self.repository.milestone_set.add(self.milestone1)

        self.issue1 = Issue.objects.create(title="Issue 1", description="Issue desc",
                                           due_date=datetime(2021, 8, 15).date(),
                                           weight=3, state=OPEN, type='ISSUE', repository=self.repository)

        self.issue2 = Issue.objects.create(title="Issue 2", description="Issue desc",
                                           due_date=datetime(2021, 8, 25).date(),
                                           weight=4, state=OPEN, type='ISSUE', repository=self.repository)

    def test_put_request_with_no_data(self):
        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': self.issue1.id}),
            data={},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_issue_success(self):
        self.label_bug = Label.objects.create(name="bug", description="", color="#f51b07",
                                              repository=self.repository)
        issue = {
            'title': 'Updated issue',
            'description': 'Issue Description',
            'due_date': '2021-12-28',
            'weight': 3,
            'state': 'CL',
            'labels': [
                {
                    'id': self.label_bug.id,
                    'name': self.label_bug.name,
                    'description': self.label_bug.description,
                    'color': self.label_bug.color
                }
            ],
            'type': 'INCIDENT'
        }
        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': self.issue1.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )

        serializer = IssueSerializer(Issue.objects.get(pk=self.issue1.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Updated issue', serializer.data['title'])
        self.assertEqual('CL', serializer.data['state'])
        self.assertEqual('INCIDENT', serializer.data['type'])

    def test_edit_issue_with_bad_credentials(self):
        issue = {
            'title': 'Updated issue',
            'description': 'Issue Description',
            'due_date': '2021-12-28',
            'weight': 3,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')

        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': self.issue1.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_issue_not_found(self):
        issue = {
            'title': 'Updated issue',
            'description': 'Issue Description',
            'due_date': '2021-12-28',
            'weight': 3,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }
        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': 123456789}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_edit_issue_duplicate_name(self):
        issue = {
            'title': self.issue2.title,
            'description': 'Issue Description',
            'due_date': '2021-12-28',
            'weight': 3,
            'state': 'OP',
            'labels': [],
            'type': 'ISSUE'
        }
        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': self.issue1.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_issue_invalid_due_date(self):
        issue = {
            'title': 'Updated issue',
            'description': 'Issue Description',
            'due_date': '2020-12-28',
            'weight': 3,
            'state': 'CL',
            'labels': [],
            'type': 'ISSUE'
        }
        response = self.client.put(
            reverse('update_issue', kwargs={'issue_id': self.issue1.id}),
            data=json.dumps(issue),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_assign_issue_to_users_success(self):
        self.pera = User.objects.create_user(username="pera", password="user", email='pera@example.com')
        self.mika = User.objects.create_user(username="mika", password="user", email='mika@example.com')
        self.zika = User.objects.create_user(username="zika", password="user", email='zika@example.com')
        count_before_assign = len(self.issue1.assignees.all())

        response = self.client.put(
            reverse('assign_issue_to_users', kwargs={'issue_id': self.issue1.id}),
            data=[self.pera.id, self.mika.id, self.zika.id],
            content_type='application/json'
        )
        issue = Issue.objects.get(pk=self.issue1.id)
        serializer = IssueSerializer(issue, many=False)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count_before_assign + 3, len(self.issue1.assignees.all()))
        self.assertEqual(response.data, serializer.data)

    def test_assign_issue_to_users_fail(self):
        self.pera = User.objects.create_user(username="pera", password="user", email='pera@example.com')
        self.pera.save()
        self.issue1.assignees.add(self.pera)
        self.issue1.save()
        count_before_assign = len(self.issue1.assignees.all())
        self.mika = User.objects.create_user(username="mika", password="user", email='mika@example.com')
        self.zika = User.objects.create_user(username="zika", password="user", email='zika@example.com')

        response = self.client.put(
            reverse('assign_issue_to_users', kwargs={'issue_id': self.issue1.id}),
            data=[2456, self.mika.id, self.zika.id],
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(count_before_assign, len(self.issue1.assignees.all()))

    def test_assign_issue_to_users_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')

        self.pera = User.objects.create_user(username="pera", password="user", email='pera@example.com')
        self.pera.save()
        self.issue1.assignees.add(self.pera)
        self.issue1.save()
        count_before_assign = len(self.issue1.assignees.all())
        self.mika = User.objects.create_user(username="mika", password="user", email='mika@example.com')
        self.zika = User.objects.create_user(username="zika", password="user", email='zika@example.com')

        response = self.client.put(
            reverse('assign_issue_to_users', kwargs={'issue_id': self.issue1.id}),
            data=[self.mika.id, self.zika.id],
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(count_before_assign, len(self.issue1.assignees.all()))

    def test_add_milestone_success(self):
        response = self.client.put(
            reverse('add_milestone_to_issue', kwargs={'issue_id': self.issue1.id, 'milestone_id': self.milestone1.id})
        )
        serializer = IssueSerializer(Issue.objects.get(pk=self.issue1.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertIsNotNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_add_milestone_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.put(
            reverse('add_milestone_to_issue', kwargs={'issue_id': self.issue1.id, 'milestone_id': self.milestone1.id})
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIsNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_add_milestone_issue_not_found(self):
        response = self.client.put(
            reverse('add_milestone_to_issue', kwargs={'issue_id': 54364563, 'milestone_id': self.milestone1.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_milestone_not_found(self):
        response = self.client.put(
            reverse('add_milestone_to_issue', kwargs={'issue_id': self.issue1.id, 'milestone_id': 54364563})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIsNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_remove_milestone_success(self):
        self.issue1.milestone = self.milestone1
        self.issue1.milestone_id = self.milestone1.id
        self.issue1.save()

        response = self.client.put(
            reverse('remove_milestone_from_issue',
                    kwargs={'issue_id': self.issue1.id, 'milestone_id': self.milestone1.id})
        )
        serializer = IssueSerializer(Issue.objects.get(pk=self.issue1.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertIsNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_remove_milestone_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        self.issue1.milestone = self.milestone1
        self.issue1.milestone_id = self.milestone1.id
        self.issue1.save()

        response = self.client.put(
            reverse('remove_milestone_from_issue',
                    kwargs={'issue_id': self.issue1.id, 'milestone_id': self.milestone1.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIsNotNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_remove_milestone_not_found(self):
        self.issue1.milestone = self.milestone1
        self.issue1.milestone_id = self.milestone1.id
        self.issue1.save()

        response = self.client.put(
            reverse('remove_milestone_from_issue', kwargs={'issue_id': self.issue1.id, 'milestone_id': 54364563})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIsNotNone(Issue.objects.get(pk=self.issue1.id).milestone)

    def test_remove_milestone_issue_not_found(self):
        response = self.client.put(
            reverse('remove_milestone_from_issue', kwargs={'issue_id': 54364563, 'milestone_id': self.milestone1.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

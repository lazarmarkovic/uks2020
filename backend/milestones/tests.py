from datetime import datetime

from django.contrib.auth.models import User
from django.test import Client
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework.utils import json

from milestones.models import Milestone
from milestones.serializers.milestone_serializers import MilestoneSerializer, MilestoneCreateSerializer
from repository.models import Repository


class TestMilestoneGet(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="admin", password="admin")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.milestone1 = Milestone.objects.create(name="Milestone1", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2021, 5, 5),
                                                   repository=self.repository)
        self.milestone2 = Milestone.objects.create(name="Milestone2", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2021, 5, 25),
                                                   repository=self.repository)
        self.milestone3 = Milestone.objects.create(name="Milestone3", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2021, 5, 25),
                                                   repository=self.repository)

        self.repository.milestone_set.add(self.milestone1)
        self.repository.milestone_set.add(self.milestone2)
        self.repository.milestone_set.add(self.milestone3)

    def test_get_all_milestones_for_repo(self):
        response = self.client.get(
            reverse('get_all_milestones_for_repository', kwargs={'repository_id': self.repository.id}))

        milestones = Milestone.objects.all()
        serializer = MilestoneSerializer(milestones, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_milestones_unauthenticated(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.get(
            reverse('get_all_milestones_for_repository', kwargs={'repository_id': self.repository.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_valid_single_milestone(self):
        response = self.client.get(
            reverse('get_one_milestone', kwargs={'milestone_id': self.milestone1.id}))
        milestone = Milestone.objects.get(pk=self.milestone1.pk)
        serializer = MilestoneSerializer(milestone)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_not_existing_milestone(self):
        response = self.client.get(
            reverse('get_one_milestone', kwargs={'milestone_id': 3099}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestMilestonePost(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=self.user)

        self.milestone = Milestone.objects.create(name="Milestone", description="Milestone Description",
                                                  start_date=datetime.now().date(),
                                                  end_date=datetime(2020, 5, 25),
                                                  repository=self.repository)

    def test_post_request_with_no_data(self):
        response = self.client.post(reverse('create_milestone', kwargs={'repository_id': self.repository.id}), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_valid_milestone(self):
        count_before_create = Milestone.objects.all().count()
        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
        milestone = {
            'name': 'New milestone',
            'description': 'Milestone Description',
            'start_date': '2021-05-05',
            'end_date': '2021-05-25'
        }
        response = self.client.post(
            reverse('create_milestone', kwargs={'repository_id': self.repository.id}),
            data=json.dumps(milestone),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(count_before_create + 1, Milestone.objects.all().count())

    def test_create_milestone_with_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.post(
            reverse('create_milestone', kwargs={'repository_id': self.repository.id}),
            data=MilestoneCreateSerializer(self.milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_milestone_repository_not_found(self):
        response = self.client.post(
            reverse('create_milestone', kwargs={'repository_id': 12345678}),
            data=MilestoneCreateSerializer(self.milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_milestone_duplicate_name(self):
        milestone = Milestone(name="Milestone", description="Milestone Description 1",
                              start_date=datetime.now().date(),
                              end_date=datetime(2020, 5, 20))
        response = self.client.post(
            reverse('create_milestone', kwargs={'repository_id': self.repository.id}),
            data=MilestoneCreateSerializer(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_milestone_start_date_before_end_date(self):
        milestone = Milestone(name="Milestone2", description="Milestone Description 1",
                              start_date=datetime.now().date(),
                              end_date=datetime(2020, 5, 20))
        response = self.client.post(
            reverse('create_milestone', kwargs={'repository_id': self.repository.id}),
            data=MilestoneCreateSerializer(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestMilestonePut(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=self.user)

        self.milestone = Milestone.objects.create(name="Milestone", description="Milestone Description",
                                                  start_date=datetime.now().date(),
                                                  end_date=datetime(2020, 5, 25),
                                                  repository=self.repository)
        self.milestone1 = Milestone.objects.create(name="Milestone1", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2020, 5, 25),
                                                   repository=self.repository)

    def test_edit_milestone_success(self):
        milestone = {
            'name': 'Updated milestone',
            'description': 'Milestone Description',
            'start_date': '2021-05-05',
            'end_date': '2021-05-25',
            'state': 'CL'
        }
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': self.milestone.id}),
            data=json.dumps(milestone),
            content_type='application/json'
        )

        serializer = MilestoneSerializer(Milestone.objects.get(pk=self.milestone.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Updated milestone', serializer.data['name'])

    def test_put_request_with_no_data(self):
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': self.milestone.id}),
            data={},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_milestone_with_bad_credentials(self):
        milestone = {
            'name': 'Updated milestone',
            'description': 'Milestone Description',
            'start_date': '2021-05-05',
            'end_date': '2021-05-25',
            'state': 'CL'
        }
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': self.milestone.id}),
            data=json.dumps(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_milestone_not_found(self):
        milestone = {
            'name': 'Updated milestone',
            'description': 'Milestone Description',
            'start_date': '2021-05-05',
            'end_date': '2021-05-25',
            'state': 'CL'
        }
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': 123456789}),
            data=json.dumps(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_edit_milestone_duplicate_name(self):
        milestone = {
            'name': self.milestone1.name,
            'description': 'Milestone Description',
            'start_date': '2021-05-05',
            'end_date': '2021-05-25',
            'state': 'CL'
        }
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': self.milestone.id}),
            data=json.dumps(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_milestone_start_date_before_end_date(self):
        milestone = {
            'name': 'Updated milestone',
            'description': 'Milestone Description',
            'end_date': '2019-05-25',
            'state': 'CL'
        }
        response = self.client.put(
            reverse('edit_milestone', kwargs={'milestone_id': self.milestone.id}),
            data=json.dumps(milestone),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestMilestoneDelete(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="user", email='user1@example.com')

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=self.user)

        self.milestone = Milestone.objects.create(name="Milestone", description="Milestone Description",
                                                  start_date=datetime.now().date(),
                                                  end_date=datetime(2020, 5, 25),
                                                  repository=self.repository)

        self.milestone1 = Milestone.objects.create(name="Milestone1", description="Milestone Description",
                                                   start_date=datetime.now().date(),
                                                   end_date=datetime(2020, 5, 25),
                                                   repository=self.repository)

    def test_delete_milestone_not_found(self):
        response = self.client.delete(
            reverse('delete_milestone', kwargs={'milestone_id': 12142526}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_milestone_bad_credentials(self):
        self.client = Client(HTTP_AUTHORIZATION='Bearer acsfhjsdkjf')
        response = self.client.delete(
            reverse('delete_milestone', kwargs={'milestone_id': self.milestone.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_milestone_success(self):
        count_before_delete = Milestone.objects.all().count()

        response = self.client.delete(
            reverse('delete_milestone', kwargs={'milestone_id': self.milestone.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count_before_delete - 1, Milestone.objects.all().count())

from django.contrib.auth.models import User
from django.test import Client
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from rest_framework.utils import json
from rest_framework_simplejwt.tokens import RefreshToken

from labels.models import Label
from labels.serializers.label_serializers import LabelSerializer
from repository.models import Repository


# noinspection DuplicatedCode
class LabelTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass", email="test@example.com")

        token = RefreshToken.for_user(self.user)
        self.client = Client(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')

        admin = User.objects.create_superuser(username="testadmin", password="adminpass")

        self.repository = Repository.objects.create(url='https://github.com/lazarmarkovic/uks2020', name='uks2020',
                                                    is_private=False, user=admin)

        self.label1 = Label.objects.create(name="Label1", description="Test description",
                                           color="blue", repository=self.repository)

        self.label2 = Label.objects.create(name="Label2", description="Test description2",
                                           color="red", repository=self.repository)

        self.repository.label_set.add(self.label1)

    def test_get_all_labels(self):
        response = self.client.get(
            reverse("get_all_labels"))

        labels = Label.objects.all()
        serializer = LabelSerializer(labels, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_labels_for_repo(self):
        response = self.client.get(
            reverse("get_all_labels_for_repo", kwargs={'repo_id': self.repository.id}))

        labels = Label.objects.filter(repository=self.repository.id)
        serializer = LabelSerializer(labels, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_labels_for_repo_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")
        response = self.client.get(
            reverse("get_all_labels_for_repo", kwargs={'repo_id': self.repository.id}))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_single_label_valid(self):
        response = self.client.get(
            reverse('get_one_label', kwargs={'label_id': self.label1.id}))
        label = Label.objects.get(pk=self.label1.pk)
        serializer = LabelSerializer(label)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_label_invalid(self):
        respone = self.client.get(
            reverse('get_one_label', kwargs={'label_id': 99}))

        self.assertEqual(respone.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_label_valid_data(self):
        count_before_create = Label.objects.all().count()

        response = self.client.post(
            reverse("create_label", kwargs={'repo_id': self.repository.id}), {
                'name': 'LabelNew',
                'description': 'Test description new label',
                'color': 'green'
            })

        count_after_create = Label.objects.all().count()
        label_new = Label.objects.get(name="LabelNew")
        serializer = LabelSerializer(label_new)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(count_after_create, count_before_create + 1)

    def test_post_label_name_exists(self):
        response = self.client.post(
            reverse("create_label", kwargs={'repo_id': self.repository.id}), {
                'name': 'Label1',
                'description': 'Test creating label with existing name',
                'color': 'white'
            })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_label_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")
        response = self.client.post(
            reverse("create_label", kwargs={'repo_id': self.repository.id}), {
                'name': 'Label',
                'description': 'Test creating label while unauthorized',
                'color': 'black'
            })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_label_invalid_repository(self):
        response = self.client.post(
            reverse("create_label", kwargs={'repo_id': 99}), {
                'name': 'Label',
                'description': 'Test creating label with invalid repository',
                'color': 'grey'
            })

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_label_valid_data(self):
        label_info = {
            'name': 'LabelUpdated',
            'description': 'Test description updated label',
            'color': 'orange'
        }

        response = self.client.put(
            reverse("update_label", kwargs={'label_id': self.label1.id}),
            data=json.dumps(label_info),
            content_type='application/json'
            )

        label_updated = Label.objects.get(pk=self.label1.id)
        serializer = LabelSerializer(label_updated)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('LabelUpdated', serializer.data['name'])
        self.assertEqual('Test description updated label', serializer.data['description'])
        self.assertEqual('orange', serializer.data['color'])

    def test_put_label_not_found(self):
        label_info = {
            'name': 'LabelUpdated',
            'description': 'Test description update label not found',
            'color': 'orange'
        }

        response = self.client.put(
            reverse("update_label", kwargs={'label_id': 99}),
            data=json.dumps(label_info),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_label_unauthorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")
        label_info = {
            'name': 'LabelUpdated',
            'description': 'Test description update label unauthorized',
            'color': 'orange'
        }

        response = self.client.put(
            reverse("update_label", kwargs={'label_id': self.label1.id}),
            data=json.dumps(label_info),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put_label_name_exists(self):
        label_info = {
            'name': 'Label2',
            'description': 'Test description update label to existing name',
            'color': 'orange'
        }

        response = self.client.put(
            reverse("update_label", kwargs={'label_id': self.label1.id}),
            data=json.dumps(label_info),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_label_valid(self):
        count_before_delete = Label.objects.all().count()

        response = self.client.delete(
            reverse("delete_label", kwargs={'label_id': self.label1.id}))

        count_after_delete = Label.objects.all().count()
        label_deleted = Label.objects.filter(name="Label1")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count_after_delete, count_before_delete - 1)
        self.assertEqual(label_deleted.exists(), False)

    def test_delete_label_not_found(self):
        response = self.client.delete(
            reverse("delete_label", kwargs={'label_id': 99}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_label_unathorized(self):
        self.client = Client(HTTP_AUTHORIZATION="Bearer bad")

        response = self.client.delete(
            reverse("delete_label", kwargs={'label_id': 99}))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from labels.models import Label
from labels.serializers.label_serializers import LabelSerializer
from repository.models import Repository


class LabelTestGet(APITestCase):

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

    def test_get_valid_single_label(self):
        response = self.client.get(
            reverse('get_one_label', kwargs={'label_id': self.label1.id}))
        label = Label.objects.get(pk=self.label1.pk)
        serializer = LabelSerializer(label)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_non_existing_label(self):
        respone = self.client.get(
            reverse('get_one_label', kwargs={'label_id': 99}))
        self.assertEqual(respone.status_code, status.HTTP_404_NOT_FOUND)

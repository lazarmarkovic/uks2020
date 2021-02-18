from repository.models import Repository
from rest_framework import serializers

from users.serializers import UserSerializer


class RepositoryCreateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    url = serializers.CharField(min_length=10, max_length=256)
    is_private = serializers.BooleanField()


class RepositoryUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    is_private = serializers.BooleanField()


class RepositorySerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = Repository
        fields = [
            'id',
            'name',
            'description',
            'url',
            'is_private',
            'user'
        ]

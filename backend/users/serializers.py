from django.contrib.auth.models import User
from rest_framework import serializers


class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=4, max_length=256)
    first_name = serializers.CharField(min_length=4, max_length=256)
    last_name = serializers.CharField(min_length=4, max_length=256)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=4, max_length=256)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_active'
        ]

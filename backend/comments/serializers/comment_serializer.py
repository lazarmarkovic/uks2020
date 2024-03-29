from abc import ABC

from rest_framework import serializers

from comments.models import Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentCreateSerializer(serializers.Serializer):
    author = serializers.CharField(max_length=256)
    content = serializers.CharField(max_length=1024)
    postedAt = serializers.CharField(max_length=256)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass






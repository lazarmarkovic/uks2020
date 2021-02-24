
from repository.models import Commit
from rest_framework import serializers


class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = [
            'id',
            'message',
            'hash',
            'timestamp',
            'author_name',
            'author_email'
        ]

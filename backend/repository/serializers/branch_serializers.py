
from repository.models import Repository, Branch
from rest_framework import serializers

from users.serializers import UserSerializer
from repository.serializers.repo_serializers import RepositorySerializer
from repository.serializers.commit_serializers import CommitSerializer


class BranchSerializer(serializers.ModelSerializer):
    creator = UserSerializer(many=False)
    repo = RepositorySerializer(many=False)
    last_commit = CommitSerializer(many=False)

    class Meta:
        model = Branch
        fields = [
            'id',
            'name',
            'creator',
            'repo',
            'last_commit',
        ]

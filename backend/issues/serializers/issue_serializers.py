from rest_framework import serializers

from issues.models import Issue
from milestones.serializers.milestone_serializers import MilestoneSerializer
from repository.serializers.repo_serializers import RepositorySerializer
from users.serializers import UserSerializer
from labels.serializers.label_serializers import LabelSerializer


class IssueUpdateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=512)
    description = serializers.CharField(max_length=1024)
    due_date = serializers.DateField()
    weight = serializers.IntegerField()
    type = serializers.CharField(
        max_length=10,
    )
    state = serializers.CharField(
        max_length=2
    )
    labels = serializers.ListField()


class IssueCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=512)
    description = serializers.CharField(max_length=1024)
    type = serializers.CharField(
        max_length=10,
    )
    due_date = serializers.DateField()
    weight = serializers.IntegerField()
    labels = serializers.ListField()


class IssueSerializer(serializers.ModelSerializer):
    milestone = MilestoneSerializer(many=False)
    repository = RepositorySerializer(many=False)
    assignees = UserSerializer(many=True)
    labels = LabelSerializer(read_only=True, many=True)

    class Meta:
        model = Issue
        fields = [
            'id',
            'title',
            'description',
            'type',
            'due_date',
            'weight',
            'assignees',
            'milestone',
            'repository',
            'state',
            'labels'
        ]

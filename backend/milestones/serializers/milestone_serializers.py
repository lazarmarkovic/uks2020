from rest_framework import serializers

from milestones.models import Milestone
from repository.serializers.repo_serializers import RepositorySerializer


class MilestoneCreateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class MilestoneUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    end_date = serializers.DateField()


class MilestoneSerializer(serializers.ModelSerializer):
    repository = RepositorySerializer(many=False)

    class Meta:
        model = Milestone
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'repository'
        ]

from rest_framework import serializers

from milestones.models import Milestone
from repository.serializers.repo_serializers import RepositorySerializer


class MilestoneCreateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    end_date = serializers.DateField()


class MilestoneUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    description = serializers.CharField(max_length=256)
    end_date = serializers.DateField()
    state = serializers.CharField(
         max_length=2
    )


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'state'
        ]

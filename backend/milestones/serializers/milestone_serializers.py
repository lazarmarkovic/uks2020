from rest_framework import serializers

from milestones.models import Milestone
from repository.serializers.repo_serializers import RepositorySerializer


class MilestoneCreateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    end_date = serializers.DateField()
    description = serializers.CharField(max_length=1024, default="", allow_blank=True, required=False)


class MilestoneUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=128)
    end_date = serializers.DateField()
    state = serializers.CharField(
         max_length=2
    )
    description = serializers.CharField(max_length=1024, default="", allow_blank=True, required=False)


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

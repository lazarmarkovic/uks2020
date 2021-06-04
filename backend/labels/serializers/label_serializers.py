from rest_framework import serializers
from labels.models import Label
from repository.serializers.repo_serializers import RepositorySerializer


class LabelSerializer(serializers.ModelSerializer):
    repository = RepositorySerializer(many=False)

    class Meta:
        model = Label
        fields = '__all__'

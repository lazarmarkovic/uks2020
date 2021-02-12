from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from django.contrib.auth.models import User
from repository.models import Repository
from repository.serializers.repo_serializers import RepositorySerializer


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_repo(request, repo_id):
    repo = Repository.objects.get(pk=repo_id)

    serializer = RepositorySerializer(repo, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_repos(request, username):
    repos = Repository.objects.filter(user__username=username)

    serializer = RepositorySerializer(repos, many=True)
    return Response(serializer.data)

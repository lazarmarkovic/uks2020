from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from repository.models import Repository
from repository.serializers.repo_serializers import (
    RepositorySerializer,
    RepositoryCreateSerializer,
    RepositoryUpdateSerializer,
)

from users.serializers import UserSerializer

from backend.exceptions import GeneralException


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_repo(request, repo_id):
    repo = get_object_or_404(Repository, pk=repo_id)

    serializer = RepositorySerializer(repo, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_repos(request, username):
    repos = Repository.objects.filter(user__username=username)

    serializer = RepositorySerializer(repos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_repo(request):
    repo_ser = RepositoryCreateSerializer(data=request.data)

    if not repo_ser.is_valid():
        raise GeneralException("Invalid request.")

    repo = Repository.objects.create(
        name=repo_ser.data['name'],
        description=repo_ser.data['description'],
        url=repo_ser.data['url'],
        private=repo_ser.data['private'],
        user=request.user,
    )

    repo.save()

    serializer = RepositorySerializer(repo, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_repo(request, repo_id):
    repo_ser = RepositoryUpdateSerializer(data=request.data)

    if not repo_ser.is_valid():
        raise GeneralException("Invalid request.")

    repo = get_object_or_404(Repository, pk=repo_id)

    repo.name = repo_ser.data['name']
    repo.description = repo_ser.data['description']
    repo.private = repo_ser.data['private']
    repo.save()

    repo.refresh_from_db()

    serializer = RepositorySerializer(repo, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_repo(request, repo_id):
    repo = get_object_or_404(Repository, pk=repo_id)
    repo.delete()

    return Response()

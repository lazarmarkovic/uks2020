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
from repository.models import Repository, Branch, Commit
from repository.serializers.repo_serializers import (
    RepositorySerializer,
    RepositoryCreateSerializer,
    RepositoryUpdateSerializer,
)

from repository.serializers.branch_serializers import BranchSerializer
from repository.serializers.commit_serializers import CommitSerializer

from users.serializers import UserSerializer

from backend.exceptions import GeneralException

from datetime import datetime
import requests
import re
import json

import pytz


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

    found_repos = Repository.objects.filter(name=repo_ser.data['name'])
    if len(found_repos) > 0:
        raise GeneralException("Repository with given name already exists.")

    repo = Repository.objects.create(
        name=repo_ser.data['name'],
        description=repo_ser.data['description'],
        url=repo_ser.data['url'],
        is_private=repo_ser.data['is_private'],
        user=request.user,
    )

    repo.save()
    load_repo(repo, request.user)

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
    repo.is_private = repo_ser.data['is_private']
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


def load_repo_readme(remote_username, remote_repo_name):
    # Fetch readme
    readme_info_resp = requests.get(
        'https://api.github.com/repos/{0}/{1}/readme'.format(remote_username, remote_repo_name))

    readme_info = readme_info_resp.json()
    readme_text_resp = requests.get(readme_info['download_url'])

    return readme_text_resp.text


def load_repo(repo, user):
    groups = re.findall(r"^https:\/\/github.com\/(.*)\/(.*)", repo.url)
    remote_username = groups[0][0]
    remote_repo_name = groups[0][1]

    # Get and set README
    repo.readme = load_repo_readme(remote_username, remote_repo_name)
    repo.save()

    branches_resp = requests.get(
        'https://api.github.com/repos/{0}/{1}/branches'.format(remote_username, remote_repo_name))

    for b in branches_resp.json():
        branch = Branch.objects.create(
            name=b['name'],
            creator=user,
            repo=repo,
            last_commit=None,
        )

        branch.save()

        commits_resp = requests.get(
            'https://api.github.com/repos/{0}/{1}/commits?sha={2}'
            .format(remote_username, remote_repo_name, b['name']))

        for c in commits_resp.json():
            c_time = datetime.strptime(
                c['commit']['author']['date'], '%Y-%m-%dT%H:%M:%SZ')

            timezone = pytz.timezone("Europe/Belgrade")
            c_time_zoned = timezone.localize(c_time)

            commit = Commit.objects.create(
                message=c['commit']['message'],
                hash=c['sha'],
                timestamp=c_time_zoned,
                author_email=c['commit']['author']['email'],
                branch=branch,
            )

    # Add latest commit to branch
    for b in branches_resp.json():
        branches = Branch.objects.filter(
            repo__name=repo.name, name=b['name'])

        commits = Commit.objects.filter(
            branch__name=b['name'], hash=b['commit']['sha'])

        if len(branches) > 0:
            if len(commits) > 0:
                branches[0].last_commit = commits[0]
                branches[0].save()

    return Response(commits_resp.json())


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_branches(request, repo_name):
    repos = Branch.objects.filter(repo__name=repo_name)

    serializer = BranchSerializer(repos, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_commits(request, repo_name, branch_name):
    repos = Commit.objects.filter(
        branch__repo__name=repo_name).filter(branch__name=branch_name.replace('~', '/'))

    serializer = CommitSerializer(repos, many=True)
    return Response(serializer.data)

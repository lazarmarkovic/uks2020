from django.contrib.auth.models import User
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from django.shortcuts import get_object_or_404

from issues.models import Issue, OPEN, CLOSED
from issues.serializers.issue_serializers import (
    IssueSerializer,
    IssueCreateSerializer, IssueUpdateSerializer
)
from labels.models import Label

from users.serializers import UserSerializer;

from backend.exceptions import GeneralException
from milestones.models import Milestone
from repository.models import Repository


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_issue(request, issue_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    serializer = IssueSerializer(issue, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_issues_for_repository(request, repository_id):
    issues = Issue.objects.filter(repository_id=repository_id)
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_issues_for_repository_by_state(request, repository_id, state):
    issues = Issue.objects.filter(repository_id=repository_id, state=state)
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_issue(request, repository_id):
    repository = get_object_or_404(Repository, pk=repository_id)
    issue_ser = IssueCreateSerializer(data=request.data)

    if not issue_ser.is_valid():
        print(issue_ser.errors)
        raise GeneralException("Invalid request.")

    found_issues = Issue.objects.filter(title=request.data["title"])
    if len(found_issues) > 0:
        raise GeneralException("Issue with given name already exists.")

    new_issue = Issue.objects.create(
        title=issue_ser.data['title'],
        description=issue_ser.data['description'],
        due_date=issue_ser.data['due_date'],
        weight=issue_ser.data['weight'],
        state=OPEN,
        type=issue_ser.data["type"],
        repository=repository
    )

    for lab in issue_ser.data['labels']:
        new_issue.labels.add(Label.objects.get(id=lab.get("id")))

    new_issue.save()

    serializer = IssueSerializer(new_issue, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_issue(request, issue_id):
    issue_ser = IssueUpdateSerializer(data=request.data)
    issue = get_object_or_404(Issue, pk=issue_id)
    _labels = []

    if not issue_ser.is_valid():
        print(issue_ser.errors)
        raise GeneralException("Invalid request.")

    found_issues = Issue.objects.filter(title=request.data["title"]).exclude(pk=issue_id)
    if len(found_issues) > 0:
        raise GeneralException("Issue with given name already exists.")

    issue.title = issue_ser.data['title']
    issue.description = issue_ser.data['description']
    issue.due_date = parse_date(issue_ser.data['due_date'])
    issue.weight = issue_ser.data['weight']
    issue.type = issue_ser.data['type']
    issue.state = issue_ser.data['state']

    for lab in issue_ser.data['labels']:
        _labels.append(Label.objects.get(id=lab.get("id")))

    issue.labels.set(_labels)

    issue.save()

    issue.refresh_from_db()
    issues = Issue.objects.filter(repository_id=issue.repository.id)
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def assign_issue_to_users(request, issue_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    user_id_list = request.data

    if len(user_id_list) > 0:
        issue.assignees.clear()
        issue.assignees.add(*user_id_list)
    else:
        issue.assignees.clear()

    issue.save()
    issue.refresh_from_db()
    serializer = IssueSerializer(issue, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_milestone_to_issue(request, issue_id, milestone_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    issue.milestone = get_object_or_404(Milestone, pk=milestone_id)
    issue.save()

    issue.refresh_from_db()
    serializer = IssueSerializer(issue, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def remove_milestone_from_issue(request, issue_id, milestone_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    milestone = get_object_or_404(Milestone, pk=milestone_id)
    issue.milestone = None
    issue.save()

    issue.refresh_from_db()
    serializer = IssueSerializer(issue, many=False)
    return Response(serializer.data)

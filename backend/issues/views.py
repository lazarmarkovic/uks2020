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

    found_issues = Issue.objects.filter(name=request.data["title"])
    if len(found_issues) > 0:
        raise GeneralException("Issue with given name already exists.")

    if not issue_ser.is_valid():
        raise GeneralException("Invalid request.")

    new_issue = Issue.objects.create(
        title=issue_ser.data['title'],
        description=issue_ser.data['description'],
        due_date=issue_ser.data['due_date'],
        weight=issue_ser.data['weight'],
        state=OPEN,
        type=issue_ser.data["type"],
        repository=repository,
    )
    new_issue.save()

    serializer = IssueSerializer(new_issue, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_issue(request, issue_id):
    issue_ser = IssueUpdateSerializer(data=request.data)

    issue = get_object_or_404(Issue, pk=issue_id)
    found_issues = Issue.objects.filter(title=request.data["title"])
    found_issues = found_issues.exclude(pk=issue_id)

    if len(found_issues) > 0:
        raise GeneralException("Issue with given name already exists.")

    if not issue_ser.is_valid():
        raise GeneralException("Invalid request.")

    issue.title = issue_ser.data['title']
    issue.description = issue_ser.data['description']
    issue.state = issue_ser.data['state']
    issue.due_date = parse_date(issue_ser.data['due_date'])
    issue.weight = issue_ser.data['weight']
    issue.save()

    issue.refresh_from_db()
    issues = Issue.objects.filter(repository_id=issue.repository.id)
    serializer = IssueSerializer(issues, many=True)
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

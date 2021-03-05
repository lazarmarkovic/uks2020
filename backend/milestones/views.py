import datetime

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

from milestones.models import Milestone, OPEN, CLOSED
from milestones.serializers.milestone_serializers import (
    MilestoneSerializer,
    MilestoneCreateSerializer,
    MilestoneUpdateSerializer
)
from repository.models import Repository

from backend.exceptions import GeneralException


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_milestone(request, milestone_id):
    milestone = get_object_or_404(Milestone, pk=milestone_id)
    serializer = MilestoneSerializer(milestone, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_milestones_for_repository(request, repository_id):
    milestones = Milestone.objects.filter(repository_id=repository_id)
    serializer = MilestoneSerializer(milestones, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_milestone(request, milestone_id):
    milestone = get_object_or_404(Milestone, pk=milestone_id)
    milestone.delete()
    return Response()


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_milestone(request, repository_id):
    found_milestones = Milestone.objects.filter(name=request.data["name"])
    if len(found_milestones) > 0:
        raise GeneralException("Milestone with given name already exists.")

    repository = get_object_or_404(Repository, pk=repository_id)
    milestone_ser = MilestoneCreateSerializer(data=request.data)

    if not milestone_ser.is_valid():
        raise GeneralException("Invalid request.")

    milestone = Milestone.objects.create(
        name=milestone_ser.data['name'],
        description=milestone_ser.data['description'],
        start_date=datetime.datetime.now().date(),
        end_date=milestone_ser.data['end_date'],
        repository=repository,
        state=OPEN,
    )
    if milestone.start_date > milestone.end_date:
        raise GeneralException("Start date must be before end date.")

    milestone.save()

    serializer = MilestoneSerializer(milestone, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def edit_milestone(request, milestone_id):
    milestone_ser = MilestoneUpdateSerializer(data=request.data)

    if not milestone_ser.is_valid():
        print(milestone_ser.errors)
        raise GeneralException("Invalid request.")

    milestone = get_object_or_404(Milestone, pk=milestone_id)

    milestone.name = milestone_ser.data['name']
    milestone.description = milestone_ser.data['description']
    milestone.end_date = parse_date(milestone_ser.data['end_date'])
    milestone.state = milestone_ser.data['state']

    if milestone.start_date > milestone.end_date:
        raise GeneralException("Start date must be before end date.")

    milestone.save()

    milestone.refresh_from_db()
    milestones = Milestone.objects.filter(repository_id=milestone.repository.id)
    serializer = MilestoneSerializer(milestones, many=True)
    return Response(serializer.data)

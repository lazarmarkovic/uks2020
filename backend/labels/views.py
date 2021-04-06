from django.http import HttpResponse
from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from backend.exceptions import GeneralException
from labels.models import Label
from labels.serializers.label_serializers import LabelSerializer
from django.shortcuts import get_object_or_404
from repository.models import Repository


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_label(request, repo_id):
    repository = get_object_or_404(Repository, pk=repo_id)

    found_labels = Label.objects.filter(repository=repo_id, name=request.data["name"])
    if len(found_labels) > 0:
        raise GeneralException("Label with given name already exists.")

    label = Label.objects.create(
        name=request.data["name"],
        description=request.data["description"],
        color=request.data["color"],
        repository=repository
    )

    label.save()

    serializer = LabelSerializer(label, many=False)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_label(request, label_id):
    label = get_object_or_404(Label, pk=label_id)
    serializer = LabelSerializer(label, many=False)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_labels(request):
    labels = Label.objects.all()
    serializer = LabelSerializer(labels, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_labels_for_repo(request, repo_id):
    labels = Label.objects.filter(repository=repo_id)
    serializer = LabelSerializer(labels, many=True)

    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_label(request, label_id):

    label = get_object_or_404(Label, pk=label_id)

    if label.name != request.data["name"]:
        found_labels = Label.objects.filter(repository=label.repository, name=request.data["name"])
        if len(found_labels) > 0:
            raise GeneralException("Label with given name already exists.")

    label.name = request.data["name"]
    label.description = request.data["description"]
    label.color = request.data["color"]
    label.save()
    label.refresh_from_db()

    serializer = LabelSerializer(label, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_label(request, label_id):
    label = get_object_or_404(Label, pk=label_id)
    label.delete()

    return Response("Success")

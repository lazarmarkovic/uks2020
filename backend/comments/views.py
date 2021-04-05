from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from backend.exceptions import GeneralException
from comments.serializers.comment_serializer import *
from issues.models import Issue
from django.shortcuts import get_object_or_404


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_comment(request, issue_id):
    issue = get_object_or_404(Issue, pk=issue_id)
    serializer = CommentCreateSerializer(data=request.data)

    if not serializer.is_valid():
        raise GeneralException("Invalid request.")

    author = get_object_or_404(User, username=serializer.data['author'])

    new_comment = Comment.objects.create(
        author=author,
        content=serializer.data['content'],
        postedAt=serializer.data['postedAt'],
        issue=issue
    )

    new_comment.save()
    return Response()


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_comments(request):

    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_comments_for_issue(request, issue_id):

    comments = Comment.objects.filter(issue=issue_id)
    serializer = CommentSerializer(comments, many=True)

    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_comment(request, comment_id):

    comment = get_object_or_404(Comment, pk=comment_id)
    comment.content = request.data['content']

    comment.save()
    comment.refresh_from_db()

    serializer = CommentSerializer(comment, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):

    comment = get_object_or_404(Comment, pk=comment_id)
    comment.delete()

    return Response("Success")

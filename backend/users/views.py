from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from users.serializers import UserSerializer, UserCreateSerializer

from backend.exceptions import GeneralException


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_auth_user(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_user(request):
    user_ser = UserCreateSerializer(data=request.data)

    if not user_ser.is_valid():
        raise GeneralException("Request is invalid.")

    if User.objects.filter(username=user_ser.data['username']).exists():
        raise GeneralException("User with given username alreagy exists.")

    validated_data = user_ser.data
    created_user = User.objects.create(
        username=validated_data['username'],
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
    )
    created_user.set_password(validated_data['password'])
    created_user.save()

    serializer = UserSerializer(created_user, many=False)
    return Response(serializer.data)

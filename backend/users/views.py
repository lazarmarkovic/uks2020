from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

from django.contrib.auth.models import User
from users.serializers import UserSerializer


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_one_user(request, user_id):
    repo = User.objects.get(pk=user_id)

    serializer = UserSerializer(repo, many=False)
    return Response(serializer.data)

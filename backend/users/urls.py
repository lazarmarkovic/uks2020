from django.urls import path

from users.views import *


urlpatterns = [
    path('<int:user_id>/get-one', get_one_user, name='get_one_user'),
    path('create', create_user, name='create_user'),
]

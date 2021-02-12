from django.urls import path

from users.views import *


urlpatterns = [
    path('<int:user_id>', get_one_user, name='get_one_user'),
]

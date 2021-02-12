from django.urls import path

from repository.views.repo_views import *


urlpatterns = [
    path('<int:repo_id>', get_one_repo, name='get_one_repo'),
    path('user/<str:username>', get_all_repos, name='get_all_repos'),
]

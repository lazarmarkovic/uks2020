from django.urls import path

from repository.views.repo_views import *


urlpatterns = [
    path('<int:repo_id>/get-one', get_one_repo, name='get_one_repo'),
    path('user/<str:username>/get-all', get_all_repos, name='get_all_repos'),
    path('create', create_repo, name='create_repo'),
    path('<int:repo_id>/update', update_repo, name='update_repo'),
    path('<int:repo_id>/delete', delete_repo, name='delete_repo'),
]

from django.urls import path

from repository.views.repo_views import *


urlpatterns = [
    path('<int:repo_id>/get-one', get_one_repo, name='get_one_repo'),
    path('user/<str:username>/get-all', get_all_repos, name='get_all_repos'),
    path('create', create_repo, name='create_repo'),
    path('<int:repo_id>/update', update_repo, name='update_repo'),
    path('<int:repo_id>/delete', delete_repo, name='delete_repo'),

    path('<int:repo_id>/reload', reload_repo, name='reload_repo'),


    path('<str:repo_name>/branches/get-all',
         get_all_branches, name='get_all_branches'),

    path('<str:repo_name>/branches/<str:branch_name>/commits/get-all',
         get_all_commits, name='get_all_commits'),
    path('<int:repo_id>/collaborators/get-all', get_repo_collaborators, name='get_repo_collaborators'),
    path('<int:repo_id>/collaborators/update', update_collaborators, name='update_collaborators'),
    path('<int:repo_id>/search/<str:search_value>', search_users_for_collaborators, name='search_users_for_collaborators')
]

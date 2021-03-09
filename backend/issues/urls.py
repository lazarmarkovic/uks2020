from django.urls import path

from issues.views import *

urlpatterns = [

    path('<int:issue_id>', get_one_issue, name='get_one_issue'),
    path('<int:repository_id>/get-all', get_all_issues_for_repository, name='get_all_issues_for_repository'),
    path('<int:repository_id>/filter/state/<slug:slug>', get_issues_for_repository_by_state, name='get_issues_for_repository_by_state'),
    path('<int:repository_id>/create', create_issue, name='create_issue'),
    path('<int:issue_id>/update', update_issue, name='update_issue'),
    path('<int:issue_id>/<int:milestone_id>', add_milestone_to_issue, name='add_milestone_to_issue'),
    path('<int:issue_id>/<int:milestone_id>/remove-milestone', remove_milestone_from_issue, name='remove_milestone_from_issue'),
    path('<int:issue_id>/assign', assign_issue_to_users, name='assign_issue_to_users')

]
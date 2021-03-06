from django.urls import path

from issues.views import *

urlpatterns = [

    path('<int:repository_id>/get-all', get_all_issues_for_repository, name='get_all_issues_for_repository'),
    path('<int:repository_id>/filter/state/<slug:slug>', get_issues_for_repository_by_state, name='get_issues_for_repository_by_state'),
    path('<int:repository_id>/create', create_issue, name='create_issue'),
    path('<int:issue_id>/update', update_issue, name='update_issue'),
    path('<int:issue_id>/<int:milestone_id>', add_milestone_to_issue, name='add_milestone_to_issue')

]
from django.urls import path
from milestones.views import *

urlpatterns = [
    path('<int:milestone_id>', get_one_milestone, name='get_one_milestone'),
    path('get_all/<int:repository_id>', get_all_milestones_for_repository, name='get_all_milestones_for_repository'),
    path('<int:milestone_id>/update', edit_milestone, name='edit_milestone'),
    path('<int:repository_id>/create', create_milestone, name='create_milestone'),
    path('<int:milestone_id>/delete', delete_milestone, name='delete_milestone')
]

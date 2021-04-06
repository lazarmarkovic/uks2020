from django.urls import path
from labels.views import *

urlpatterns = [
    path('<int:repo_id>/create', create_label, name="create_label"),
    path('get/<int:label_id>', get_one_label, name="get_one_label"),
    path('get_all', get_all_labels, name="get_all_labels"),
    path('<int:repo_id>/get_all', get_labels_for_repo, name="get_all_labels_for_repo"),
    path('update/<int:label_id>', update_label, name="update_label"),
    path('delete/<int:label_id>', delete_label, name="delete_label")
]

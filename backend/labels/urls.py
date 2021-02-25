from django.urls import path
from labels.views import *

urlpatterns = [
    path('test', index, name='index'),
    path('create', create_label, name="create_label"),
    path('get/<str:label_name>', get_one_label, name="get_one_label"),
    path('get_all', get_all_labels, name="get_all_labels"),
    path('update/<str:label_name>', update_label, name="update_label"),
    path('delete/<str:label_name>', delete_label, name="delete_label")
]

from django.urls import path

from comments.views import *

urlpatterns = [
    path('<int:issue_id>/create', create_comment, name='create_comment'),
    path('get_all', get_all_comments, name='get_all_comments'),
    path('<int:issue_id>/get_all', get_comments_for_issue, name='get_comments_for_issue'),
    path('delete/<int:comment_id>', delete_comment, name="delete_comment"),
    path('update/<int:comment_id>', update_comment, name="update_comment")
]

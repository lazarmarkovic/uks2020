from django.urls import path

from .views.repo_views import *

urlpatterns = [
    path('repos/<int:repo_id>/', getOneRepository, name='getOneRepository'),
    path('repos/user/<str:username>/',
         getAllRepositories, name='getAllRepositories'),
]

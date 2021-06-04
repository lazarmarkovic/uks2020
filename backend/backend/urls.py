from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin panel route
    path('admin', admin.site.urls),

    # Auth routes
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # App routes
    path('api/repos/', include('repository.urls')),
    path('api/users/', include('users.urls')),
    path('api/labels/', include('labels.urls')),
    path('api/milestones/', include('milestones.urls')),
    path('api/issues/', include('issues.urls')),
    path('api/comments/', include('comments.urls'))
]

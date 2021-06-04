from django.contrib import admin

# Register your models here.
from issues.models import Issue

admin.site.register(Issue)
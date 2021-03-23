from django.db import models
from django.contrib.auth.models import User

from issues.models import Issue


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=1024)
    postedAt = models.CharField(max_length=256)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)

    def __str__(self):
        return self.content

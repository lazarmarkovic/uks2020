from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Repository(models.Model):
    name = models.CharField(max_length=512)
    description = models.CharField(max_length=1024)
    url = models.CharField(max_length=512)
    private = models.BooleanField(default=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Branch(models.Model):
    name = models.CharField(max_length=512)

    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name


class Commit(models.Model):
    message = models.CharField(max_length=1024)
    hash = models.CharField(max_length=1024)
    timestamp = models.DateTimeField()

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.message
from django.db import models

from repository.models import Repository


class Label(models.Model):
    name = models.CharField(max_length=512)
    description = models.CharField(max_length=1024)
    color = models.CharField(max_length=512)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name

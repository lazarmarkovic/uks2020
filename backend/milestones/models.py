from django.db import models

from repository.models import Repository


class Milestone(models.Model):
    name = models.CharField(max_length=512)
    description = models.CharField(max_length=1024)
    start_date = models.DateField()
    end_date = models.DateField()
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-end_date']

    def __str__(self):
        return self.name

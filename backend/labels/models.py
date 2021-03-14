from django.db import models


class Label(models.Model):
    name = models.CharField(max_length=512)
    description = models.CharField(max_length=1024)
    color = models.CharField(max_length=512)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name

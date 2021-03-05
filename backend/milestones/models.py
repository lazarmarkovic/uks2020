from django.db import models

from repository.models import Repository

OPEN = 'OP'
CLOSED = 'CL'
STATE = (
    (OPEN, 'Open'),
    (CLOSED, 'Closed')
)


class Milestone(models.Model):
    name = models.CharField(max_length=512)
    description = models.CharField(max_length=1024, blank=True, default='')
    start_date = models.DateField()
    end_date = models.DateField()
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    state = models.CharField(
        max_length=2,
        choices=STATE,
        default=OPEN
    )

    class Meta:
        ordering = ['-end_date']

    def __str__(self):
        return self.name

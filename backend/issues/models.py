from django.contrib.auth.models import User
from django.db import models

from milestones.models import Milestone
from repository.models import Repository
from labels.models import Label

ISSUE = 'ISSUE'
INCIDENT = 'INCIDENT'
ISSUE_TYPE = (
    (ISSUE, 'Issue'),
    (INCIDENT, 'Incident')
)
OPEN = 'OP'
CLOSED = 'CL'
STATE = (
    (OPEN, 'Open'),
    (CLOSED, 'Closed')
)


class Issue(models.Model):
    title = models.CharField(max_length=512)
    description = models.CharField(max_length=1024)
    type = models.CharField(
        max_length=10,
        choices=ISSUE_TYPE,
        default=ISSUE
    )
    due_date = models.DateField()
    weight = models.IntegerField()
    assignees = models.ManyToManyField(User, blank=True)
    milestone = models.ForeignKey(Milestone, blank=True, null=True, on_delete=models.SET_NULL)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    state = models.CharField(
        max_length=2,
        choices=STATE,
        default=OPEN
    )
    labels = models.ManyToManyField(Label, blank=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return self.title

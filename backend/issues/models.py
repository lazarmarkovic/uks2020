from django.contrib.auth.models import User
from django.db import models

from milestones.models import Milestone
from repository.models import Repository

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
    assignees = models.ManyToManyField(User)
    # TODO Make this field optional
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    state = models.CharField(
        max_length=2,
        choices=STATE,
        default=OPEN
    )

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return self.title

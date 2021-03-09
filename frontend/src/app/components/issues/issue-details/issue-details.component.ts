import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { User } from 'src/app/models/user.model';
import { Milestone } from 'src/app/models/milestone.model';
import { IssueService } from 'src/app/services/issue.service';
import { MilestoneService } from 'src/app/services/milestone.service';
import { RepoService } from 'src/app/services/repo.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignIssueDialogComponent } from '../assign-issue-dialog/assign-issue-dialog.component';
import { IssueAssignMilestoneComponent } from '../issue-assign-milestone/issue-assign-milestone.component';
import { State } from 'src/app/shared/enums/state';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {
  repo_id: any;
  issue_id: any;
  issue: Issue;
  milestones: Milestone[] = [];
  collaborators: User[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private fb: FormBuilder, private issueService: IssueService, private milestoneService: MilestoneService,
    private repositoryService: RepoService, private toastrService: ToastrService, public dialog: MatDialog) {
    this.repo_id = this.route.snapshot.params.repo_id;
    this.issue_id = this.route.snapshot.params.issue_id;
  }

  ngOnInit(): void {
    this.getIssue(this.issue_id);
    this.getMilestonesForRepository(this.repo_id);
    this.getRepositoryCollaborators(this.repo_id);

    console.log(this.issue);
  }

  getIssue(issue_id: number) {
    this.issueService.getIssue(issue_id).subscribe(
      (issue: Issue) => {
        this.issue = issue;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      });


  }

  getMilestonesForRepository(repoId) {
    this.milestoneService.gettMilestonesForRepository(repoId).subscribe(
      (milestones: Milestone[]) => {
        this.milestones = milestones;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  getRepositoryCollaborators(repoId) {
    this.repositoryService.getCollaborators(repoId).subscribe(
      (collaborators: User[]) => {
        this.collaborators = collaborators;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  closeIssue(issue: Issue) {
    issue.state = State.Closed.toString();
    this.issueService.updateIssue(issue).subscribe(
      (data: Issue[]) => {
        this.issue = issue;
        this.toastrService.success("Issue closed.", "Success");
      },
      (err: HttpErrorResponse) => {
        this.toastrService.error("Could not close issue.", "Error");
        console.log(err.error);
      }
    );
  }

  openAddMilestoneDialog(issue: Issue) {
    const dialogRef = this.dialog.open(IssueAssignMilestoneComponent, {
      width: '40em',
      data: { 'issue': issue, 'milestones': this.milestones }
    });

    dialogRef.afterClosed().subscribe((result: Issue) => {
      if (result != null && result != undefined) {
        this.issue = result;
      } else {
        this.route.queryParams.subscribe(params => {
          this.issue = JSON.parse(params["issue"]);
        });

      }
    });

  }

  removeMilestone(issue_id: number, milestone_id: number) {
    this.issueService.removeMilestone(issue_id, milestone_id).subscribe(
      (data: Issue) => {
        this.issue = data;
        this.toastrService.success("Milestone removed.", "Success");
      },
      (err: HttpErrorResponse) => {
        this.toastrService.error("Could not remove milestone.", "Error");
        console.log(err.error);
      }
    );
  }

  openAssignIssueDialog(issue: Issue) {
    const dialogRef = this.dialog.open(AssignIssueDialogComponent, {
      width: '40em',
      data: { 'issue': issue, 'collaboratos': this.collaborators }
    });

    dialogRef.afterClosed().subscribe((result: Issue) => {
      if (result != null && result != undefined) {
        this.issue = result;
      }
    });
  }

  back() {
    this.location.back();
  }

  public get state(): typeof State {
    return State;
  }

}

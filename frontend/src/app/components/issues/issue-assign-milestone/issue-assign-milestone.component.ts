import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { Milestone } from 'src/app/models/milestone.model';
import { IssueService } from 'src/app/services/issue.service';
import { IssueDetailsComponent } from '../issue-details/issue-details.component';

@Component({
  selector: 'app-issue-assign-milestone',
  templateUrl: './issue-assign-milestone.component.html',
  styleUrls: ['./issue-assign-milestone.component.css']
})
export class IssueAssignMilestoneComponent implements OnInit {

  issue: Issue;
  milestones: Milestone[] = [];
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<IssueDetailsComponent>, private fb: FormBuilder, private issueService: IssueService, private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.issue = this.data.issue;
    this.milestones = this.data.milestones;
    this.form = this.fb.group({
      'milestone': [
        (this.issue.milestone != null && this.issue.milestone != undefined) ? this.issue.milestone.id : '', Validators.required]
    });
  }

  get milestone(): AbstractControl {
    return this.form.get('milestone')
  }

  onSubmit() {

    if (this.milestone.value != undefined) {

      console.log(this.milestone.value)
      this.issueService.assignMilestoneToIssue(this.issue.id, this.milestone.value).subscribe(

        (issue: Issue) => {
          this.toastrService.success("Milestone successfully assigned.", "Success");
          this.dialogRef.close(issue);
        },
        (error: HttpErrorResponse) => {
          this.toastrService.error("Error occurred while assigning milestone.", "Error")
          console.log(error.error);
        }
      );
    }
  }
}

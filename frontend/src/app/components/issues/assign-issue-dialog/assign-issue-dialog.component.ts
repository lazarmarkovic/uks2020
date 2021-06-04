import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { User } from 'src/app/models/user.model';
import { IssueService } from 'src/app/services/issue.service';
import { IssueDetailsComponent } from '../issue-details/issue-details.component';

@Component({
  selector: 'app-assign-issue-dialog',
  templateUrl: './assign-issue-dialog.component.html',
  styleUrls: ['./assign-issue-dialog.component.css']
})
export class AssignIssueDialogComponent implements OnInit {

  issue: Issue;
  collaborators: User[] = [];
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<IssueDetailsComponent>, private fb: FormBuilder, private issueService: IssueService, private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.issue = this.data.issue;
    this.collaborators = this.data.collaboratos;
    this.form = this.fb.group({
      'assignees': [
        (this.issue.assignees != null && this.issue.assignees != undefined) ? this.issue.assignees.map((val) => { return val.id }) : '']
    });
  }

  get assignees(): AbstractControl {
    return this.form.get('assignees')
  }

  onSubmit() {

    if (this.assignees.value != undefined) {

      console.log(this.assignees.value)
      this.issueService.assignIssue(this.assignees.value, this.issue.id).subscribe(

        (issue: Issue) => {
          this.toastrService.success("Issue successfully assigned.", "Success");
          this.dialogRef.close(issue);
        },
        (error: HttpErrorResponse) => {
          this.toastrService.error("Error occurred while assigning issue.", "Error")
          console.log(error.error);
        }
      );
    }
  }


}

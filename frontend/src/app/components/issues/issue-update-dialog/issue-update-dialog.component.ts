import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import { IssueType } from 'src/app/shared/enums/issue-type';

import { IssueListComponent } from '../issue-list/issue-list.component';

@Component({
  selector: 'app-issue-update-dialog',
  templateUrl: './issue-update-dialog.component.html',
  styleUrls: ['./issue-update-dialog.component.css']
})
export class IssueUpdateDialogComponent implements OnInit {

  repo_id = null;
  issue_types = [IssueType.Issue, IssueType.Incident];
  form = new FormGroup({
    name: new FormControl(this.data.title, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(this.data.description, [Validators.required]),
    serializedDate: new FormControl((new Date(this.data.due_date)).toISOString(), [Validators.required]),
    weight: new FormControl(this.data.weight, [Validators.required]),
    type: new FormControl(this.data.type, [Validators.required]),
  });

  constructor(
    private tService: ToastrService,
    public dialogRef: MatDialogRef<IssueListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Issue,
    private issueService: IssueService,
    public activetedRoute: ActivatedRoute) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
  }


  onSubmit(): void {

    const end_date = new Date(this.date.value).toISOString().slice(0, 10);

    let newIssue = Issue.IssueWithId(this.name.value, this.description.value, end_date, this.data.state, this.weight.value, this.data.id, this.type.value);

    this.issueService.updateIssue(newIssue).subscribe(
      (response: any) => {
        this.tService.success("Issue successfully updated.", "Success");
        this.dialogRef.close('updated');
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.tService.error("Error while updating issue.", "Error");
      }
    )
  }

  get name(): AbstractControl {
    return this.form.get('name');
  }
  get description(): AbstractControl {
    return this.form.get('description');
  }

  get date(): AbstractControl {
    return this.form.get('serializedDate');
  }

  get weight(): AbstractControl {
    return this.form.get('weight')
  }

  get type(): AbstractControl {
    return this.form.get('type')
  }
}

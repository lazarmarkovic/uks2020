import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { Label } from 'src/app/models/label.model';
import { IssueService } from 'src/app/services/issue.service';
import { LabelService } from 'src/app/services/label.service';
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
  labels: Label[] = [];
  selectedLabels: Label[] = [];

  form = new FormGroup({
    name: new FormControl(this.data.title, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(this.data.description, [Validators.required]),
    serializedDate: new FormControl((new Date(this.data.due_date)).toISOString(), [Validators.required]),
    weight: new FormControl(this.data.weight, [Validators.required]),
    type: new FormControl(this.data.type, [Validators.required]),
  });

  constructor(
    private tService: ToastrService,
    private labelService: LabelService,
    public dialogRef: MatDialogRef<IssueListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Issue,
    private issueService: IssueService,
    public activetedRoute: ActivatedRoute) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
    this.selectedLabels = this.data.labels;
  }

  ngOnInit(): void {
    this.getLabels();
  }

  getLabels(){
    this.labelService.getAll().subscribe((response: Label[]) =>{
      this.labels = response;
    },
    error =>{
      console.log('Error loading labels');
      console.log(error);
    });
  }

  labelSelected(label: Label){
    if (this.selectedLabels.find((l) => l.id === label.id)) {
      this.selectedLabels = this.selectedLabels.filter((l) => l.id !== label.id);
    } else {
      this.selectedLabels.push(label);
    }
  }

  onSubmit(): void {

    const end_date = new Date(this.date.value).toISOString().slice(0, 10);

    let newIssue = Issue.IssueWithId(this.name.value, this.description.value, end_date, this.data.state, this.weight.value, this.data.id, this.type.value, null, null, this.selectedLabels);

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

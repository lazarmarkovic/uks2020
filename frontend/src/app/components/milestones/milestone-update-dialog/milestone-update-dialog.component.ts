import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Milestone } from 'src/app/models/milestone.model';
import { MilestoneService } from 'src/app/services/milestone.service';
import { MilestoneListComponent } from '../milestone-list/milestone-list.component';

@Component({
  selector: 'app-milestone-update-dialog',
  templateUrl: './milestone-update-dialog.component.html',
  styleUrls: ['./milestone-update-dialog.component.css']
})
export class MilestoneUpdateDialogComponent implements OnInit {
  repo_id = null;
  form = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(this.data.description),
    serializedDate: new FormControl((new Date(this.data.end_date)).toISOString())
  });

  constructor(
    private tService: ToastrService,
    public dialogRef: MatDialogRef<MilestoneListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Milestone,
    private milestoneService: MilestoneService,
    public activetedRoute: ActivatedRoute) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {

  }


  onSubmit(): void {

    const end_date = new Date(this.date.value).toISOString().slice(0, 10);
    let desc = this.description.value;
    if (desc === null || desc === undefined) {
      desc = "";
    }

    let newMilestone = Milestone.MilestoneWithId(this.name.value, desc, this.data.start_date, end_date, this.data.state, this.data.id);

    this.milestoneService.updateMilestone(newMilestone).subscribe(
      (response: any) => {
        this.tService.success("Milestone successfully updated.", "Success");
        this.dialogRef.close('updated');
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.tService.error("Error while updating milestone.", "Error")
      }
    )
  }

  get name(): AbstractControl {
    return this.form.get('name')
  }
  get description(): AbstractControl {
    return this.form.get('description')
  }

  get date(): AbstractControl {
    return this.form.get('serializedDate')
  }


}

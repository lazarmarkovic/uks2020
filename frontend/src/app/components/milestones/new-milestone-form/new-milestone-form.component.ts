import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Milestone } from 'src/app/models/milestone.model';
import { MilestoneService } from 'src/app/services/milestone.service';

@Component({
  selector: 'app-new-milestone-form',
  templateUrl: './new-milestone-form.component.html',
  styleUrls: ['./new-milestone-form.component.css']
})
export class NewMilestoneFormComponent implements OnInit {
  repo_id: any;
  form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(null),
    serializedDate: new FormControl((new Date()).toISOString())
  });

  constructor(private milestoneService: MilestoneService, public activetedRoute: ActivatedRoute, private tService: ToastrService, private location: Location) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
  }


  cancel() {
    this.form.reset();
    this.location.back();
  }

  onSubmit(): void {
    if (this.form?.valid) {
      const start_date = new Date().toISOString().slice(0, 10);
      const end_date = new Date(this.date.value).toISOString().slice(0, 10);

      let desc = this.description.value;
      if (desc === null || desc === undefined) {
        desc = "";
      }

      let newMilestone = Milestone.MilestoneWithoutId(this.name.value, desc, start_date, end_date, 'OP');
      console.log(newMilestone);
      this.milestoneService.createMilestone(newMilestone, this.repo_id).subscribe(
        (reponse: Milestone) => {
          this.tService.success("New milestone created.", "Success")

        },
        (err: HttpErrorResponse) => this.tService.error("Could not create milestone!", "Error"));
    }
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

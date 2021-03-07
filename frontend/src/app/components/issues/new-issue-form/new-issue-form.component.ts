import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { Milestone } from 'src/app/models/milestone.model';
import { User } from 'src/app/models/user.model';
import { IssueService } from 'src/app/services/issue.service';
import { MilestoneService } from 'src/app/services/milestone.service';

@Component({
  selector: 'app-new-issue-form',
  templateUrl: './new-issue-form.component.html',
  styleUrls: ['./new-issue-form.component.css']
})
export class NewIssueFormComponent implements OnInit {

  repo_id: any;
  milestones: Milestone[] = [];
  collaborators: User[] = [];
  assigneesId: number[] = [];
  issue_types = ['Issue', 'Incident'];
  form: FormGroup;

  constructor(private fb: FormBuilder, private issueService: IssueService, private milestoneService: MilestoneService, public activetedRoute: ActivatedRoute, private tService: ToastrService, private location: Location) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
    console.log(this.issue_types)
    this.getMilestonesForRepository(this.repo_id);
    this.form = this.fb.group({
      'title': ['', [Validators.required, Validators.minLength(5)]],
      'description': ['', [Validators.required]],
      'weight': ['', [Validators.required]],
      'serializedDate': [(new Date()).toISOString()],
      'milestone': [''],
      'assignees': [''],
      'type': ['']
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

  }

  cancel() {
    this.form.reset();
    this.location.back();
  }

  onSubmit(): void {
    if (this.form?.valid) {
      const due_date = new Date(this.date.value).toISOString().slice(0, 10);
      let milestone = this.milestones.filter(m => m.id === this.milestone.value).pop();
      let assignees = [];

      if (this.assignees.value != undefined) {
        this.assigneesId.push(this.assignees.value);

        this.assigneesId.forEach(element => {
          assignees.push(this.collaborators.filter(c => c.id === element))
        });
      }

      let newIssue = Issue.IssueWithoutId(this.title.value, this.description.value, due_date, 'OP', this.type.value.toUpperCase(), this.weight.value, milestone, assignees);
      console.log(newIssue);
      this.issueService.createIssue(newIssue, this.repo_id).subscribe(
        (reponse: Issue) => {
          this.tService.success("New issue created.", "Success")
          this.location.back();

        },
        (err: HttpErrorResponse) => {
          console.log(err.error)
          this.tService.error("Could not create new issue. Please, try again.", "Error");
        }
      );
    }

  }

  get title(): AbstractControl {
    return this.form.get('title')
  }
  get description(): AbstractControl {
    return this.form.get('description')
  }

  get date(): AbstractControl {
    return this.form.get('serializedDate')
  }

  get milestone(): AbstractControl {
    return this.form.get('milestone')
  }

  get assignees(): AbstractControl {
    return this.form.get('assignees')
  }

  get type(): AbstractControl {
    return this.form.get('type')
  }

  get weight(): AbstractControl {
    return this.form.get('weight')
  }

}

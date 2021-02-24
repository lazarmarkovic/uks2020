import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {Repo} from "./../../models/repo.model";
import {RepositoryListComponent} from "./../repository-list/repository-list.component";

import {FormControl, FormGroup, Validators} from '@angular/forms';

import {RepoService} from './../../services/repo.service';

import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-repo-update-dialog',
  templateUrl: './repo-update-dialog.component.html',
  styleUrls: ['./repo-update-dialog.component.css']
})
export class RepoUpdateDialogComponent implements OnInit {
  constructor(
    private repoService: RepoService,
    private tService: ToastrService,
    public dialogRef: MatDialogRef<RepositoryListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Repo) {}

  updateRepoForm = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(this.data.description),
  });
  is_private: boolean = false;

  ngOnInit(): void {
    this.is_private = this.data.is_private;
  }

  onSubmit(): void {
    this.repoService
    .update(
      this.data.id,
      this.updateRepoForm.value.name,
      this.updateRepoForm.value.description,
      this.is_private,
    ).subscribe(
      (response: any) => {
        this.tService.success("Repo successfully updated repo.", "Success");
        this.dialogRef.close('updated');
      },
      err => {
        console.log(err);
        this.tService.error("Error while opdating repo.", "Error")
      }
    )
  }

  checkPrivate(event): void {
    this.is_private = event.checked;
  }
}

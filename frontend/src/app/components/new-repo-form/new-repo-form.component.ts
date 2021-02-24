import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {RepoService} from '../../services/repo.service';

import {Repo} from '../../models/repo.model';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-new-repo-form',
  templateUrl: './new-repo-form.component.html',
  styleUrls: ['./new-repo-form.component.css']
})
export class NewRepoFormComponent implements OnInit {

  newRepoForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(null),
    url: new FormControl(null, [Validators.required, Validators.minLength(5)]),
  });

  is_private: boolean = false;

  constructor(
    private router: Router,
    private repoService: RepoService,
    private tService: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  checkPrivate(event){
    this.is_private = event.checked;
  }

  onSubmit(): void {
    if (this.newRepoForm?.valid) {
      this.repoService.create(
        this.newRepoForm.value.name,
        this.newRepoForm.value.description,
        this.newRepoForm.value.url,
        this.is_private,
      ).subscribe((reponse: Repo) => {
        this.tService.success("Repo successfully added.", "Success");
        this.router.navigate(['/repos']);

      },
      err => this.tService.error("Error while adding new repo. Is your github repo public?", "Error"));
    }
  }

}

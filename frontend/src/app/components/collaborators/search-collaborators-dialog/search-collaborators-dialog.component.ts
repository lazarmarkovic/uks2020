import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RepoService } from 'src/app/services/repo.service';
import { CollaboratorsComponent } from '../collaborators.component';

@Component({
  selector: 'app-search-collaborators-dialog',
  templateUrl: './search-collaborators-dialog.component.html',
  styleUrls: ['./search-collaborators-dialog.component.css']
})
export class SearchCollaboratorsDialogComponent implements OnInit {

  filteredUsers$: Observable<User[]>;
  isLoading = false;
  collaborators: number[] = [];
  repo_id;
  userInput = new FormControl();

  constructor(public dialogRef: MatDialogRef<CollaboratorsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private authService: AuthService, private repositoryService: RepoService, private toastrService: ToastrService) {
    this.collaborators = data.collaborators;
    this.repo_id = data.repo_id;
  }



  ngOnInit(): void {
    this.filteredUsers$ = this.userInput.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          console.log("value je:  " + value)
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );

  }

  lookup(value: string): Observable<User> {
    return this.repositoryService.searchUsersForCollaborators(value.toLowerCase().trim(), this.repo_id).pipe(

      catchError(_ => {
        return of(null);
      })
    );
  }

  addCollaborator(new_collaborator_id) {

    if (new_collaborator_id != null && new_collaborator_id != undefined) {

      this.collaborators.push(new_collaborator_id);

      this.repositoryService.updateCollaborators(this.repo_id, this.collaborators).subscribe(

        (collaborators: User[]) => {
          this.toastrService.success("Collaborator successfully added.", "Success");
          this.dialogRef.close(collaborators);
        },
        (error: HttpErrorResponse) => {
          this.toastrService.error("Error occurred while adding collaborator.", "Error")
          console.log(error.error);
        }
      );
    }
  }

}

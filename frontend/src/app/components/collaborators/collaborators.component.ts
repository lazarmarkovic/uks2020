import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RepoService } from 'src/app/services/repo.service';
import { SearchCollaboratorsDialogComponent } from './search-collaborators-dialog/search-collaborators-dialog.component';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css']
})
export class CollaboratorsComponent implements OnInit, AfterViewInit {

  repo_id;
  collaborators: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'username', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(public activetedRoute: ActivatedRoute, private repositoryService: RepoService, private location: Location, private toastrService: ToastrService,
    private authService: AuthService, public dialog: MatDialog) {
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
    this.getRepositoryCollaborators(this.repo_id);
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  getRepositoryCollaborators(repoId) {
    this.repositoryService.getCollaborators(repoId).subscribe(
      (collaborators: User[]) => {


        this.collaborators = collaborators.filter(c => c.id != this.getSignedUserId());
        this.dataSource = new MatTableDataSource<User>(this.collaborators);
        this.dataSource.paginator = this.paginator;
        console.log(this.collaborators)
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  back() {
    this.location.back();
  }

  removeCollaborator(collaborator_id: number) {
    let collaborators = this.collaborators.filter(c => c.id != collaborator_id);

    this.repositoryService.updateCollaborators(this.repo_id, collaborators.map(c => { return c.id })).subscribe(
      (collaborators: User[]) => {

        this.collaborators = collaborators.filter(c => c.id != this.getSignedUserId());
        this.dataSource = new MatTableDataSource<User>(this.collaborators);
        this.dataSource.paginator = this.paginator;
        //console.log(this.collaborators)
        this.toastrService.success("Collaborator removed.", "Success");
      },
      (error: HttpErrorResponse) => {
        this.toastrService.error("Could not remove collaborator.", "Error");
        console.log(error.error);
      }
    );
  }

  openSerachCollaboratorsDialog() {
    const dialogRef = this.dialog.open(SearchCollaboratorsDialogComponent, {
      data: { 'repo_id': this.repo_id, 'collaborators': this.collaborators.map(c => { return c.id }) }
    });

    dialogRef.afterClosed().subscribe((result: User[]) => {
      if (result != null && result != undefined) {
        this.collaborators = result.filter(c => c.id != this.getSignedUserId());
        this.dataSource = new MatTableDataSource<User>(this.collaborators);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  getSignedUserId() {
    return this.authService.getCurrentUser().id;
  }



}

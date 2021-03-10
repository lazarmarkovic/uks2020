import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { RepoService } from 'src/app/services/repo.service';

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

  constructor(public activetedRoute: ActivatedRoute, private repositoryService: RepoService, private location: Location) {
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
        this.collaborators = collaborators;
        this.dataSource = new MatTableDataSource<User>(collaborators);
        this.dataSource.paginator = this.paginator;
        console.log(collaborators)
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

  }



}

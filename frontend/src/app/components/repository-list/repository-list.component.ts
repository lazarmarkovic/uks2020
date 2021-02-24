import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../models/user.model';
import {RepoService} from '../../services/repo.service';
import {AuthService} from '../../services/auth.service';
import {SelectedRepoService} from '../../data-services/selected-repo.service';
import { Repo } from 'src/app/models/repo.model';

import {ToastrService} from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RepoUpdateDialogComponent} from './../repo-update-dialog/repo-update-dialog.component';
import {ConfirmationDialogComponent} from './../confirmation-dialog/confirmation-dialog.component';


export interface RepoElement {
  id: string;
  name: string;
  creationTime: Date;
}

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'action'];
  dataSource = new MatTableDataSource<Repo>([]);
  user: User = null;

  showSpinner: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private repoService: RepoService,
    private authService: AuthService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    private selectedRepoService: SelectedRepoService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user == undefined) {
      this.tService.info('User not logged in', 'Error');
    } else {
      this.getRepos();
    }
  }

  getRepos(): void {
    this.showSpinner = true;
    this.repoService
      .getAll(this.user.username)
      .subscribe(
        (response: Repo[]) => {
          this.dataSource = new MatTableDataSource<Repo>(response);
          this.dataSource.paginator = this.paginator;

          this.showSpinner = false;
        },
        error => {
          console.log('Repos load error:');
          console.log(error);

          this.showSpinner = false;
        }
      );
  }

  viewBranches(repo: Repo): void {
    this.selectedRepoService.setRepo(repo);
    this.router.navigate([`repos/${repo.name}/branches`]);
  }

  refreshTable(): void {
    this.getRepos();
  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  openUpdateRepoDialog(repo: Repo): void {
    const dialogRef = this.dialog.open(RepoUpdateDialogComponent, {
      width: '40em',
      data: repo,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.refreshTable();
      }
    });
  }


  openReloadConfirmationDialog(repo: Repo): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25em',
      data: {
        title: "Confirm action",
        text: "Please confirm that you want to reload repo from Github: " + repo.name,
        buttonName: "Reload",
        callback: () => {this.reloadRepo(repo.id)}
      },
    });
  }

  reloadRepo(repoId: number): void {
    this.showSpinner = true;
    this.repoService
    .reload(repoId)
    .subscribe(
      (response: any) => {
        this.tService.success('Successfuly reloaded repo from Github.', 'Success');
        this.refreshTable();

        this.showSpinner = false;
      },
      err => {
        console.log(err);
        this.tService.error('Cannot reload given repo.', 'Error');

        this.showSpinner = false;
      }
    )
  }


  openDeleteConfirmationDialog(repo: Repo): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25em',
      data: {
        title: "Confirm action",
        text: "Please confirm that you want to delete repo: " + repo.name,
        buttonName: "Delete",
        callback: () => {this.deleteRepo(repo.id)}
      },
    });
  }

  deleteRepo(repoId: number): void {
    this.showSpinner = true;

    this.repoService
    .delete(repoId)
    .subscribe(
      (response: any) => {
        this.tService.success('Successfuly deleted repo.', 'Success');
        this.refreshTable();

        this.showSpinner = false;
      },
      err => {
        console.log(err);
        this.tService.error('Cannot delete given repo.', 'Error');

        this.showSpinner = false;
      }
    )
  }
}

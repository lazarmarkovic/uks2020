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
    private selectedRepoService: SelectedRepoService
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
    this.repoService
      .getAll(this.user.username)
      .subscribe(
        (response: Repo[]) => {
          this.dataSource = new MatTableDataSource<Repo>(response);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Repos load error:');
          console.log(error);
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
}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

import {User} from '../../models/user.model';
import {CommitService} from '../../services/commit.service';
import {AuthService} from '../../services/auth.service';
import {SelectedRepoService} from '../../data-services/selected-repo.service';

import { Repo } from 'src/app/models/repo.model';
import { Branch } from 'src/app/models/branch.model';
import { Commit } from 'src/app/models/commit.model';

import {ToastrService} from 'ngx-toastr';


import * as dayjs from 'dayjs';


export interface CommitElement {
  id: string;
  name: string;
  creationTime: Date;
}

@Component({
  selector: 'app-commit-list',
  templateUrl: './commit-list.component.html',
  styleUrls: ['./commit-list.component.css']
})
export class CommitListComponent implements OnInit, AfterViewInit {

  sub = null;
  repo_name = null;
  branch_name = null;

  displayedColumns: string[] = ['message', 'hash', 'time'];
  user: User = null;

  dataSource = new MatTableDataSource<Commit>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private commitService: CommitService,
    private authService: AuthService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    private selectedRepoService: SelectedRepoService
  ) {
    this.dataSource = new MatTableDataSource<Commit>([]);
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.params.subscribe(params => {
      this.repo_name = params['repo'];
      this.branch_name = params['branch'];
    });

    this.user = this.authService.getCurrentUser();
    if (this.user == undefined) {
      this.tService.info('User not logged in', 'Error');
    } else {
      this.getBranches();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getBranches(): void {
    this.commitService
      .getAll(this.repo_name, this.branch_name)
      .subscribe(
        (response: Commit[]) => {
          let newReponse = [];
          response.forEach((commit) => {
            newReponse.push(
              {...commit, 
                timestamp: dayjs(commit['timestamp']).format('DD.MM.YYYY. HH:mm:ss')})
          })
          this.dataSource = new MatTableDataSource<Commit>(newReponse);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Commits load error:');
          console.log(error);
        }
      );
  }

  viewCommits(repoId: string): void {
    this.router.navigate(['/commits/' + repoId]);
  }

  refreshTable(): void {
    this.getBranches();
  }

  back() {
    this.location.back();
  }

  goToGithubCommit(hash: string){
    window.open(this.selectedRepoService.getRepo().url + "/commit/" + hash, "_blank");
  }
}

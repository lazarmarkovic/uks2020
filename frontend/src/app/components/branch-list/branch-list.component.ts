import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';


import {User} from '../../models/user.model';
import {BranchService} from '../../services/branch.service';
import {RepoService} from '../../services/repo.service';

import {AuthService} from '../../services/auth.service';
import { Repo } from 'src/app/models/repo.model';

import {ToastrService} from 'ngx-toastr';
import { Branch } from 'src/app/models/branch.model';

import {SelectedRepoService} from '../../data-services/selected-repo.service';


import * as dayjs from 'dayjs';


export interface BranchElement {
  id: string;
  name: string;
  creationTime: Date;
}

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit, AfterViewInit {

  sub = null;
  repo = null;

  repo_obj = null;

  displayedColumns: string[] = ['name', 'last_commit'];
  dataSource = new MatTableDataSource<Branch>([]);
  user: User = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private branchService: BranchService,
    private repoService: RepoService,
    private authService: AuthService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    private selectedRepoService: SelectedRepoService,
  ) {}

  ngOnInit(): void {
    this.repo_obj = this.selectedRepoService.getRepo();
    console.log(this.repo_obj.readme)

    this.sub = this.activeRoute.params.subscribe(params => {
      this.repo = params['repo'];
    });

    this.user = this.authService.getCurrentUser();
    if (this.user == undefined) {
      this.tService.info('User not logged in', 'Error');
    } else {
      this.getBranches();
    }
  }

  getBranches(): void {
    this.branchService
      .getAll(this.repo)
      .subscribe(
        (response: Branch[]) => {
          let newReponse = [];
          response.forEach((branch) => {
            newReponse.push(
              {...branch, 
                last_commit: 
                  {...branch['last_commit'], 
                  timestamp: dayjs(branch['last_commit']['timestamp']).format('DD.MM.YYYY.')}})
          })
          this.dataSource = new MatTableDataSource<Branch>(newReponse);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Branches load error:');
          console.log(error);
        }
      );
  }

  viewCommits(repo_name: string, branch_name: string): void {
    this.router.navigate([`repos/${repo_name}/branches/${branch_name.replace('/', '~')}/commits`]);
  }

  refreshTable(): void {
    this.getBranches();
  }

  back() {
    this.location.back();
  }

  goToGithubBranch(url: string){
    window.open(url, "_blank");
  }

  onReady(){
    console.log("markdown ready")
  }
}

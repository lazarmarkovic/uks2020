import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../models/user.model';
import {CommitService} from '../../services/commit.service';
import {AuthService} from '../../services/auth.service';
import { Repo } from 'src/app/models/repo.model';
import { Branch } from 'src/app/models/branch.model';
import { Commit } from 'src/app/models/commit.model';

import {ToastrService} from 'ngx-toastr';


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

  displayedColumns: string[] = ['message'];
  user: User = null;

  dataSource = new MatTableDataSource<Commit>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private commitService: CommitService,
    private authService: AuthService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private tService: ToastrService,
  ) {
    this.dataSource = new MatTableDataSource<Commit>([]);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Commit>([]);

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
      .getAll(7, 5)
      .subscribe(
        (response: Commit[]) => {
          this.dataSource = new MatTableDataSource<Commit>(response);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Commits load error:');
          console.log(error);
        }
      );
  }

  viewForm(repoId: string): void {
    this.router.navigate(['/api/commits/' + repoId]);
  }

  refreshTable(): void {
    this.getBranches();
  }
}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../models/user.model';
import {RepoService} from '../../services/repo.service';
import {AuthService} from '../../services/auth.service';
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

  displayedColumns: string[] = ['name'];
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
        },
        error => {
          console.log('Repos load error:');
          console.log(error);
        }
      );
  }

  viewForm(repoId: string): void {
    this.router.navigate(['/api/repos/' + repoId]);
  }

  refreshTable(): void {
    this.getRepos();
  }
}

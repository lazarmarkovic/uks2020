import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../models/user.model';
import {BranchService} from '../../services/branch.service';
import {AuthService} from '../../services/auth.service';
import { Repo } from 'src/app/models/repo.model';

import {ToastrService} from 'ngx-toastr';
import { Branch } from 'src/app/models/branch.model';


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

  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Branch>([]);
  user: User = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private branchService: BranchService,
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
      this.getBranches();
    }
  }

  getBranches(): void {
    this.branchService
      .getAll(7)
      .subscribe(
        (response: Branch[]) => {
          this.dataSource = new MatTableDataSource<Branch>(response);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Branches load error:');
          console.log(error);
        }
      );
  }

  viewForm(repoId: string): void {
    this.router.navigate(['/api/branches/' + repoId]);
  }

  refreshTable(): void {
    this.getBranches();
  }
}

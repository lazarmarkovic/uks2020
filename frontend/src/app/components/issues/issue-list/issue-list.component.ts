import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/models/issue.model';
import { IssueService } from 'src/app/services/issue.service';
import { State } from 'src/app/shared/enums/state';
import { IssueUpdateDialogComponent } from '../issue-update-dialog/issue-update-dialog.component';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  repo_id = null;
  displayedColumns: string[] = ['title', 'description', 'due_date', 'state', 'weight', 'milestone', 'action'];
  dataSource = new MatTableDataSource<Issue>([]);
  issues: Issue[];
  localeID: string;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  close_position = new FormControl(this.positionOptions[5]);

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private issueService: IssueService,
    public activetedRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    @Inject(LOCALE_ID) localID: string,
    public dialog: MatDialog) {
    this.localeID = localID;
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
    this.getIssuesForRepository(this.repo_id);
  }

  getIssuesForRepository(repositoryId: number) {
    this.issueService.getIssuesForRepository(repositoryId).subscribe(
      (data: Issue[]) => {
        this.issues = data;
        //this.issues.forEach(m => console.log(m));
        this.dataSource = new MatTableDataSource<Issue>(data);
        this.dataSource.paginator = this.paginator;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  changeState(issue: Issue, new_state: string) {

    let edited = Issue.IssueWithId(issue.title, issue.description, issue.due_date, new_state, issue.weight, issue.id, issue.type, issue.milestone);
    console.log(edited);
    this.issueService.updateIssue(edited).subscribe(
      data => {
        this.dataSource = new MatTableDataSource<Issue>(data);
        this.dataSource.paginator = this.paginator;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  viewIssueDetails(issue: Issue) {
    this.router.navigate([`repos/${this.repo_id}/issues/${issue.id}`]);
  }

  edit(issue: Issue) {
    const dialogRef = this.dialog.open(IssueUpdateDialogComponent, {
      width: '40em',
      data: issue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getIssuesForRepository(this.repo_id);
      }
    });
  }

  back() {
    this.location.back();
  }

  public get stateEnum(): typeof State {
    return State;
  }
}

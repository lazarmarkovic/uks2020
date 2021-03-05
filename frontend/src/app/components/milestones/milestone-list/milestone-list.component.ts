import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Milestone } from 'src/app/models/milestone.model';
import { AuthService } from 'src/app/services/auth.service';
import { RepoService } from 'src/app/services/repo.service';
import { formatDate, Location } from '@angular/common';
import { MilestoneService } from 'src/app/services/milestone.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-milestone-list',
  templateUrl: './milestone-list.component.html',
  styleUrls: ['./milestone-list.component.css']
})
export class MilestoneListComponent implements OnInit, AfterViewInit {
  repo_id = null;
  displayedColumns: string[] = ['name', 'description', 'end_date', 'state', 'action'];
  dataSource = new MatTableDataSource<Milestone>([]);
  milestones: Milestone[];
  localeID: string;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  reopen_position = new FormControl(this.positionOptions[5]);
  edit_position = new FormControl(this.positionOptions[2]);

  ngAfterViewInit(): void {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private milestoneService: MilestoneService,
    private repoService: RepoService,
    private authService: AuthService,
    private router: Router,
    public activetedRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    @Inject(LOCALE_ID) localID: string) {
    this.localeID = localID;
    this.repo_id = this.activetedRoute.snapshot.params.repo_id;
  }

  ngOnInit(): void {
    this.gettMilestonesForRepository(this.repo_id);
  }

  gettMilestonesForRepository(repositoryId: number) {
    this.milestoneService.gettMilestonesForRepository(repositoryId).subscribe(
      (data: Milestone[]) => {
        this.milestones = data;
        this.milestones.forEach(m => console.log(m));
        this.dataSource = new MatTableDataSource<Milestone>(data);
        this.dataSource.paginator = this.paginator;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  remove(milestone) {
    this.milestoneService.deleteMilestone(milestone.id).subscribe(
      data => {
        let milestones = this.milestones.filter(method => method.id != milestone.id);
        this.dataSource = new MatTableDataSource<Milestone>(milestones);
        this.dataSource.paginator = this.paginator;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  edit(milestone) {

  }

  changeState(milestone: Milestone, new_state: string) {

    let edited = new Milestone(milestone.id, milestone.name, milestone.description, milestone.start_date, milestone.end_date, new_state);
    console.log(edited);
    this.milestoneService.updateMilestone(edited).subscribe(
      data => {
        this.dataSource = new MatTableDataSource<Milestone>(data);
        this.dataSource.paginator = this.paginator;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  back() {
    this.location.back();
  }


}

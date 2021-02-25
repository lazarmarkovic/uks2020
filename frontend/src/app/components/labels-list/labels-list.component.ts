import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { Label } from 'src/app/models/label.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LabelService } from 'src/app/services/label.service';

export interface LabelElement {
  id: string;
  name: string;
  creationTime: Date;
}

@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.css']
})
export class LabelsListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'description', 'color'];
  dataSource = new MatTableDataSource<Label>([]);
  user: User = null;
  showSpinner: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit(): void{
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private labelService: LabelService,
    private authService: AuthService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private tService: ToastrService,
    private location: Location,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user == undefined) {
      this.tService.info('User not logged in', 'Error');
    } else {
      this.getLabels();
    }
  }

  getLabels(): void {
    this.showSpinner = true;
    this.labelService
      .getAll()
      .subscribe(
        (response: Label[]) => {
          this.dataSource = new MatTableDataSource<Label>(response);
          this.dataSource.paginator = this.paginator;
          this.showSpinner = false;
        },
        error => {
          console.log('Error loading Labels');
          console.log(error);
          this.showSpinner = false;
        }
      );
  }

  refreshTable(): void {
    this.getLabels();
  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  

}

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
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { LabelUpdateDialogComponent } from '../label-update-dialog/label-update-dialog.component';
import { NewLabelFormComponent } from '../new-label-form/new-label-form.component';


@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.css']
})
export class LabelsListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'description', 'color', 'action'];
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

  openCreateLabelDialog(): void{
    const dialogRef = this.dialog.open(NewLabelFormComponent,{
      width: '40em',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'created'){
        this.refreshTable();
      }
    });
  }

  openUpdateLabelDialog(label: Label): void {
    const dialogRef = this.dialog.open(LabelUpdateDialogComponent, {
      width: '40em',
      data: label,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'updated'){
        this.refreshTable();
      }
    });
  }

  openDeleteConfirmationDialog(label: Label): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25em',
      data: {
        title: "Confirm action",
        text: "Please confirm that you want to delete label: " + label.name,
        buttonName: "Delete",
        callback: () => { this.deleteLabel(label.name) }
      },
    });
  }

  deleteLabel(labelName: string): void {
    this.showSpinner = true;
    this.labelService
    .deleteLabel(labelName)
    .subscribe(
      (resposne: any) => {
        this.tService.success('Successfully deleted label.', 'Success');
        this.refreshTable();
        this.dialog.closeAll();
        this.showSpinner = false;
      },
      err => {
        console.log(err);
        this.tService.error('Cannot delete given label.', 'Error');
        this.showSpinner = false;
      }
    )
  }
}

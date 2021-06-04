import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {RepositoryListComponent} from "./../repository-list/repository-list.component";


export interface ConfDialogData {
  title: string;
  text: string;
  buttonName: string;
  callback: Function;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RepositoryListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfDialogData) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.data.callback();
  }

}

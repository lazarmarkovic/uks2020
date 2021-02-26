import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Label } from 'src/app/models/label.model';
import { LabelService } from 'src/app/services/label.service';
import { LabelsListComponent } from '../labels-list/labels-list.component';

@Component({
  selector: 'app-label-update-dialog',
  templateUrl: './label-update-dialog.component.html',
  styleUrls: ['./label-update-dialog.component.css']
})
export class LabelUpdateDialogComponent implements OnInit {

  constructor(
    private labelService: LabelService,
    private tService: ToastrService,
    public dialogRef: MatDialogRef<LabelsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Label ) {}

  updateLabelForm = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(this.data.description),
    color: new FormControl(this.data.color, [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.labelService
    .updateLabel(
      this.data.name,
      this.updateLabelForm.value.name,
      this.updateLabelForm.value.description,
      this.updateLabelForm.value.color
    ).subscribe(
      (response: any) => {
        this.tService.success("Successfully updated label.", "Success");
        this.dialogRef.close('updated');
      },
      err => {
        console.log(err);
        this.tService.error("Error while updating label.", "Error");
      }
    )
  }

}

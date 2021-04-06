import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Label } from 'src/app/models/label.model';
import { LabelService } from 'src/app/services/label.service';
import { LabelsListComponent } from '../labels-list/labels-list.component';

@Component({
  selector: 'app-new-label-form',
  templateUrl: './new-label-form.component.html',
  styleUrls: ['./new-label-form.component.css']
})
export class NewLabelFormComponent implements OnInit {

  constructor(
    private labelService: LabelService,
    private tService: ToastrService,
    public dialogRef: MatDialogRef<LabelsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  newLabelForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    description: new FormControl(''),
    color: new FormControl(null, [Validators.required]),
  })

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.newLabelForm?.valid) {
      this.labelService.createLabel(
        this.newLabelForm.value.name,
        this.newLabelForm.value.description,
        this.newLabelForm.value.color,
        this.data,
      ).subscribe((response: Label) => {
        this.tService.success("Label successfully created.", "Success");
        this.dialogRef.close('created');
      },
      err => this.tService.error("Error while creating new label.", "Error"));
    }
  }

}

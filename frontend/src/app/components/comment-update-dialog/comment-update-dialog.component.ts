import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IssueService } from 'src/app/services/issue.service';
import { IssueListComponent } from '../issues/issue-list/issue-list.component';
import { Comment } from 'src/app/models/comment.model';
import { isThisTypeNode } from 'typescript';
import { CreateComment } from 'src/app/models/create-comment.model';

@Component({
  selector: 'app-comment-update-dialog',
  templateUrl: './comment-update-dialog.component.html',
  styleUrls: ['./comment-update-dialog.component.css']
})
export class CommentUpdateDialogComponent implements OnInit {

  commentForm: FormGroup;

  constructor(
    private issueService: IssueService,
    private tService: ToastrService,
    public dialogRef: MatDialogRef<IssueListComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public comment: Comment ) {}


  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      'content': [this.comment.content, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.commentForm?.valid) {
      const date = new Date().toISOString().slice(0, 10);
      const updatedComment = new CreateComment(this.comment.author, this.commentForm.value.content, date);
      this.issueService.updateComment(this.comment.id, updatedComment)
        .subscribe((response: any) => {
          this.tService.success("Successfully updated comment.", "Success");
          this.dialogRef.close('updated');
        },
        err => {
          console.log(err);
          this.tService.error("Error while updating comment.", "Error");
        }

        )
    }
  }

}

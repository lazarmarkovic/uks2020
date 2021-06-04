
/* Crucial */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

/* My imports  */
import { AuthInterceptor } from './auth/auth.interceptor';
import { APIInterceptor } from './auth/api.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/main/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginComponent } from './components/login/login.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { CommitListComponent } from './components/commit-list/commit-list.component';
import { NewRepoFormComponent } from './components/new-repo-form/new-repo-form.component';
import { RepoUpdateDialogComponent } from './components/repo-update-dialog/repo-update-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NewMilestoneFormComponent } from './components/milestones/new-milestone-form/new-milestone-form.component';
import { MilestoneUpdateDialogComponent } from './components/milestones/milestone-update-dialog/milestone-update-dialog.component';
import { NewIssueFormComponent } from './components/issues/new-issue-form/new-issue-form.component';
import { IssueDetailsComponent } from './components/issues/issue-details/issue-details.component';
import { AssignIssueDialogComponent } from './components/issues/assign-issue-dialog/assign-issue-dialog.component';
import { IssueAssignMilestoneComponent } from './components/issues/issue-assign-milestone/issue-assign-milestone.component';
import { CollaboratorsComponent } from './components/collaborators/collaborators.component';
import { SearchCollaboratorsDialogComponent } from './components/collaborators/search-collaborators-dialog/search-collaborators-dialog.component';
import { IssueUpdateDialogComponent } from './components/issues/issue-update-dialog/issue-update-dialog.component';

/* Material design imports */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';

/* Markdown viewer*/
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { LabelsListComponent } from './components/labels-list/labels-list.component';
import { LabelUpdateDialogComponent } from './components/label-update-dialog/label-update-dialog.component';
import { NewLabelFormComponent } from './components/new-label-form/new-label-form.component';
import { MilestoneListComponent } from './components/milestones/milestone-list/milestone-list.component';
import { DatePipe } from '@angular/common';
import { IssueListComponent } from './components/issues/issue-list/issue-list.component';
import { MatSelectModule } from '@angular/material/select';
import { CommentUpdateDialogComponent } from './components/comment-update-dialog/comment-update-dialog.component';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RepositoryListComponent,
    BranchListComponent,
    CommitListComponent,
    NewRepoFormComponent,
    RepoUpdateDialogComponent,
    ConfirmationDialogComponent,
    LabelsListComponent,
    LabelUpdateDialogComponent,
    NewLabelFormComponent,
    MilestoneListComponent,
    NewMilestoneFormComponent,
    MilestoneUpdateDialogComponent,
    IssueListComponent,
    NewIssueFormComponent,
    IssueDetailsComponent,
    AssignIssueDialogComponent,
    IssueAssignMilestoneComponent,
    CollaboratorsComponent,
    SearchCollaboratorsDialogComponent,
    IssueUpdateDialogComponent,
    CommentUpdateDialogComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    MarkdownModule.forRoot({ loader: HttpClient }), // Markdown shit

    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatOptionModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    NgbModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

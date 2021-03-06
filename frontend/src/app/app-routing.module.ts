import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { CommitListComponent } from './components/commit-list/commit-list.component';
import { NewRepoFormComponent } from './components/new-repo-form/new-repo-form.component';
import { MilestoneListComponent } from './components/milestones/milestone-list/milestone-list.component';
import { AuthGuardService } from './shared/route-guards/auth-guard.service';
import { NewMilestoneFormComponent } from './components/milestones/new-milestone-form/new-milestone-form.component';
import { IssueListComponent } from './components/issues/issue-list/issue-list.component';





const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'repos', component: RepositoryListComponent },
  { path: 'repos/:repo/branches', component: BranchListComponent },
  { path: 'repos/:repo/branches/:branch/commits', component: CommitListComponent },

  { path: 'repos/add', component: NewRepoFormComponent },
  { path: 'repos/:repo_id/milestones', component: MilestoneListComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'repos/:repo_id/milestones/create', component: NewMilestoneFormComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'repos/:repo_id/issues', component: IssueListComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
  //{ path: 'repos/:repo_id/issues/create', component: NewMilestoneFormComponent, pathMatch: 'full', canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

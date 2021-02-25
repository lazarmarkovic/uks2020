import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './components/login/login.component';
import {RepositoryListComponent} from './components/repository-list/repository-list.component';
import {BranchListComponent} from './components/branch-list/branch-list.component';
import {CommitListComponent} from './components/commit-list/commit-list.component';
import { NewRepoFormComponent } from './components/new-repo-form/new-repo-form.component';
import { LabelsListComponent } from './components/labels-list/labels-list.component';





const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'repos', component: RepositoryListComponent},
  {path: 'repos/:repo/branches', component: BranchListComponent},
  {path: 'repos/:repo/branches/:branch/commits', component: CommitListComponent},

  {path: 'repos/add', component: NewRepoFormComponent},

  {path: 'labels', component: LabelsListComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

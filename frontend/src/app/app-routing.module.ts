import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './components/login/login.component';
import {RepositoryListComponent} from './components/repository-list/repository-list.component';
import {BranchListComponent} from './components/branch-list/branch-list.component';
import {CommitListComponent} from './components/commit-list/commit-list.component';




const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'repos', component: RepositoryListComponent},
  {path: 'branches', component: BranchListComponent},
  {path: 'commits', component: CommitListComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

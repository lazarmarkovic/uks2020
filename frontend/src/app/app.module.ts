
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



/* Material design imports */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';

/* Markdown viewer*/
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RepositoryListComponent,
    BranchListComponent,
    CommitListComponent,
    NewRepoFormComponent,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

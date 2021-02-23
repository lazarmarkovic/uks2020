import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private httpClient: HttpClient) { }

  getAll(repo_name: string): Observable<any> {
    return this.httpClient.get(`/api/repos/${repo_name}/branches/get-all`);
  }
}

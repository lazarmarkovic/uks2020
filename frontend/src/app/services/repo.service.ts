import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepoService {

  constructor(private httpClient: HttpClient) { }

  getAll(username: string): Observable<any> {
    return this.httpClient.get(`/api/repos/user/${username}/get-all`);
  }
}

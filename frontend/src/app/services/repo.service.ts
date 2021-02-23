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

  create(
    name: string, 
    description: string, 
    url: string, 
    is_private: boolean): Observable<any> {
      
    return this.httpClient.post('/api/repos/create', {
      name,
      description,
      url,
      is_private,
    })
  }
}

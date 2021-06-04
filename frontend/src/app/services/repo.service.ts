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


  update(
    repoId: number,
    name: string,
    description: string,
    is_private: boolean): Observable<any> {

    return this.httpClient.put(`/api/repos/${repoId}/update`, {
      name,
      description,
      is_private,
    })
  }

  reload(repoId: number) {
    return this.httpClient.put(`/api/repos/${repoId}/reload`, {})

  }

  delete(repoId: number): Observable<any> {
    return this.httpClient.delete(`/api/repos/${repoId}/delete`)
  }

  getCollaborators(repoId: number): Observable<any> {
    return this.httpClient.get(`/api/repos/${repoId}/collaborators/get-all`)
  }

  updateCollaborators(repo_id: number, collaborator_id_list: number[]): Observable<any> {
    return this.httpClient.put(`/api/repos/${repo_id}/collaborators/update`, collaborator_id_list)
  }

  searchUsersForCollaborators(search_val: string, repo_id: number): Observable<any> {
    return this.httpClient.get(`/api/repos/${repo_id}/search/${search_val}`);
  }
}

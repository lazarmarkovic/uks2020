import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private httpClient: HttpClient) {

  }

  getIssue(issue_id: number): Observable<any> {
    return this.httpClient.get(`/api/issues/${issue_id}`);
  }

  getIssuesForRepository(repositoryId: number): Observable<any> {
    return this.httpClient.get(`/api/issues/${repositoryId}/get-all`);
  }

  createIssue(issue: Issue, repositoryId: number): Observable<any> {
    return this.httpClient.post(`/api/issues/${repositoryId}/create`, issue);
  }

  updateIssue(issue: Issue): Observable<any> {
    return this.httpClient.put(`/api/issues/${issue.id}/update`, issue);
  }

  assignIssue(assignees: number[], issue_id: number): Observable<any> {
    return this.httpClient.put(`/api/issues/${issue_id}/assign`, assignees);
  }

  assignMilestoneToIssue(issue_id: number, milestone_id: number): Observable<any> {
    return this.httpClient.put(`/api/issues/${issue_id}/${milestone_id}`, {});
  }

  removeMilestone(issue_id: number, milestone_id: number): Observable<any> {
    return this.httpClient.put(`/api/issues/${issue_id}/${milestone_id}/remove-milestone`, {});
  }
}

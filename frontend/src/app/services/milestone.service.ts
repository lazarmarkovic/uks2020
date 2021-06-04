import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Milestone } from '../models/milestone.model';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {

  constructor(private httpClient: HttpClient) {

  }

  gettMilestonesForRepository(repositoryId: number): Observable<any> {
    return this.httpClient.get(`/api/milestones/get_all/${repositoryId}`);
  }

  createMilestone(milestone: Milestone, repositoryId: number): Observable<any> {
    return this.httpClient.post(`/api/milestones/${repositoryId}/create`, milestone);
  }

  updateMilestone(milestone: Milestone): Observable<any> {
    return this.httpClient.put(`/api/milestones/${milestone.id}/update`, milestone);
  }

  deleteMilestone(milestoneId: number): Observable<any> {
    return this.httpClient.delete(`/api/milestones/${milestoneId}/delete`);
  }

}

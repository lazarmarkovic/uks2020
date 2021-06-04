import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor(private HttpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.HttpClient.get('/api/labels/get_all');
  }

  getLabelsForRepository(repositoryId: number): Observable<any> {
    return this.HttpClient.get(`/api/labels/${repositoryId}/get_all`)
  }

  createLabel(
    name: string,
    description: string,
    color: string,
    repositoryId: number): Observable<any> {

      return this.HttpClient.post(`/api/labels/${repositoryId}/create`, {
        name,
        description,
        color,
      });
    }

  updateLabel(
    labelId: number,
    name: string,
    description: string,
    color: string): Observable<any> {
      
      return this.HttpClient.put(`/api/labels/update/${labelId}`, {
        name,
        description,
        color,
      }); 
    }

  deleteLabel(labelId: number): Observable<any> {
    return this.HttpClient.delete(`/api/labels/delete/${labelId}`);
  }
}

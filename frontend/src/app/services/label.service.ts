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

  createLabel(
    name: string,
    description: string,
    color: string): Observable<any> {

      return this.HttpClient.post('/api/labels/create', {
        name,
        description,
        color,
      });
    }

  updateLabel(
    labelName: string,
    name: string,
    description: string,
    color: string): Observable<any> {
      
      return this.HttpClient.put(`/api/labels/update/${labelName}`, {
        name,
        description,
        color,
      }); 
    }

  deleteLabel(labelName: string): Observable<any> {
    return this.HttpClient.delete(`/api/labels/delete/${labelName}`);
  }
}

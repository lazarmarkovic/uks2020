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
}

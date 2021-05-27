import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateUser} from "../models/create-user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  register(userToCreate: CreateUser): Observable<any> {
    return this.httpClient.post('/api/users/create', userToCreate);
  }
}

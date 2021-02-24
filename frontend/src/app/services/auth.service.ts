import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const user = {
      username,
      password,
    };
    return this.httpClient.post('/api/token', user);
  }

  getAuthUser(): Observable<any> {
    return this.httpClient.get('/api/users/get-auth');
  }

  getCurrentUser(): User | undefined {
    const userJSON = sessionStorage.getItem('authUser');
    if (userJSON) {
      return JSON.parse(userJSON);
    } else {
      return undefined;
    }
  }
}

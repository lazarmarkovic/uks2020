import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  canActivate() {
    if (this.authenticationService.getCurrentUser() === undefined) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}

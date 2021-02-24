import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem('accessToken');
    if (token != null && !request.url.includes("https://raw.githubusercontent.com") && !request.url.includes("https://api.github.com")) {
      const clonedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clonedReq).pipe(
        tap(
          succ => { },
          err => {
            sessionStorage.removeItem('accessToken');
          }
        )
      );
    }
    return next.handle(request);
  }
}

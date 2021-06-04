import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.includes("https://raw.githubusercontent.com") && !req.url.includes("https://api.github.com")) {
      const apiReq = req.clone({ url: `http://65.21.180.192:8080${req.url}` });
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}

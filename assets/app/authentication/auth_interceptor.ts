import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable()

// It seems interceptor only gets called on routes using HttpClient NOT Http
// this means that while we can't get post routes to work with HttpClient
// interceptors are useless

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      const authToken = this.authService.getToken();
      const authRequest = req.clone({
        headers: req.headers.set("authorization", "Bearer " + authToken)
      });

    return next.handle(authRequest);
  }
}

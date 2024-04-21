import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {UserService} from "../service/user.service";
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService:UserService) {}

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   console.log("inside interceptor");
  //   let authReq = req;
  //   const loginPath = '/login';
  //   const token = this.userService.getToken();
  //   console.log(token);
  //   if (token != null) {
  //     authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  //
  //   }
  //   return next.handle(authReq).pipe(tap(()=>{},
  //     (err :any)=>{
  //       if (err instanceof HttpErrorResponse) {
  //         if (err.status !== 401 || window.location.pathname === loginPath) {
  //           // if (err.status !== 401 ) {
  //           return;
  //         }
  //         this.userService.logout()
  //         window.location.href=loginPath;
  //
  //       }
  //
  //
  //     }));
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("inside interceptor");
    let authReq = req.clone();
    const loginPath = '/login';
    const token = this.userService.getToken();
    console.log(token);
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

    return next.handle(authReq).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            // Unauthorized or Forbidden status, logout user
            this.userService.logout();
            window.location.href = loginPath;
          }
        }
        return throwError(error);
      })
    );
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

import { Injectable } from '@angular/core';

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError, finalize} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {LoaderService} from '../tools/loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorizationData: string = localStorage.getItem('ls.authorizationData');
    this.loaderService.show();
    if (authorizationData) {
      const data =  JSON.parse(authorizationData);
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + data.token) });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    const url = environment.serverURL + request.url;

    request = request.clone({ headers: request.headers.set('Accept', 'application/json'), url: url });

    return next.handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
          this.loaderService.hide();
          if (event instanceof HttpResponse) {
            // console.log(event.status);
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          this.loaderService.hide();
          if (error.status === 401) {
            // window.location.href = 'https://www.reachr.com.br/#/login';
          }
          return throwError(error);
        }),
        finalize(() => this.loaderService.hide()));
  }
}

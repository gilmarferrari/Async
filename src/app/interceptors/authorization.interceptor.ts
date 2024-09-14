import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../environment/environment';
import { AuthorizationType } from '../home/home.component';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (Environment.AuthorizationType != AuthorizationType.None) {
            request = request.clone({
                setHeaders: { Authorization: `${Environment.AuthorizationType} ${Environment.Token}` }
            });
        }

        return next.handle(request);
    }
}
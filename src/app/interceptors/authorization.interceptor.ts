import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Singleton } from '../singletons/singleton';
import { AuthorizationType } from '../home/home.component';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (Singleton.AuthorizationType != AuthorizationType.None) {
            request = request.clone({
                setHeaders: { Authorization: `${Singleton.AuthorizationType} ${Singleton.Token}` }
            });
        }

        return next.handle(request);
    }
}
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { LoadingService } from '../services/loading.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingService.setLoading(true, request.url);
        return next.handle(request)
            .pipe(catchError((err) => {
                this.loadingService.setLoading(false, request.url);
                
                return throwError(err);
            }))
            .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
                if (evt instanceof HttpResponse) {
                    this.loadingService.setLoading(false, request.url);
                }

                return evt;
            }));
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private http: HttpClient) { }

    get(request: string, params: any | null) {
        return this.http.get<any>(request, { params: params }).pipe();
    }

    put(request: string, params: any | null, body: any | null) {
        let headers = new HttpHeaders();

        try {
            JSON.parse(body);
            headers = headers.set('Content-Type', 'application/json');
        }
        catch { }

        return this.http.put<any>(request, body, { params: params, headers: headers }).pipe();
    }

    post(request: string, params: any | null, body: any | null) {
        let headers = new HttpHeaders();

        try {
            JSON.parse(body);
            headers = headers.set('Content-Type', 'application/json');
        }
        catch { }

        return this.http.post<any>(request, body, { params: params, headers: headers }).pipe();
    }

    delete(request: string, params: any | null, body: any | null) {
        let headers = new HttpHeaders();

        try {
            JSON.parse(body);
            headers = headers.set('Content-Type', 'application/json');
        }
        catch { }

        return this.http.delete<any>(request,  { params: params, body: body, headers: headers }).pipe();
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    headers: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    get(request: string, params: any | null) {
        return this.http.get<any>(request, { params: params }).pipe();
    }

    put(request: string, params: any | null, body: any | null) {
        return this.http.put<any>(request, body, { params: params, headers: this.headers }).pipe();
    }

    patch(request: string, params: any | null, body: any | null) {
        return this.http.patch<any>(request, body, { params: params, headers: this.headers }).pipe();
    }

    post(request: string, params: any | null, body: any | null) {
        return this.http.post<any>(request, body, { params: params, headers: this.headers }).pipe();
    }

    delete(request: string, params: any | null, body: any | null) {
        return this.http.delete<any>(request,  { params: params, body: body, headers: this.headers }).pipe();
    }
}

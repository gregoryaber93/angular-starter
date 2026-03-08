import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/';
  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  get<T>(endpoint: string, params?: HttpParams) {
    return this.http.get<T>(this.apiUrl + endpoint, {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(this.apiUrl + endpoint, body, {
      headers: this.defaultHeaders,
    });
  }

  put<T>(endpoint: string, body: any) {
    return this.http.put<T>(this.apiUrl + endpoint, body, {
      headers: this.defaultHeaders,
    });
  }

  delete<T>(endpoint: string, params?: HttpParams) {
    return this.http.delete<T>(this.apiUrl + endpoint, {
      headers: this.defaultHeaders,
      params: params,
    });
  }
}

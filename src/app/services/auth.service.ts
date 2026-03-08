import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private loginUrl = 'http://localhost:3000/auth/login'; // Adjust this URL to your backend

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    this.deleteToken();
  }

  getToken(): string | null {
    return this.getCookie(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  private setToken(token: string): void {
    // Set cookie with 7 days expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    this.setCookie(this.TOKEN_KEY, token, expirationDate);
  }

  private deleteToken(): void {
    this.deleteCookie(this.TOKEN_KEY);
  }

  private setCookie(name: string, value: string, expirationDate: Date): void {
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}


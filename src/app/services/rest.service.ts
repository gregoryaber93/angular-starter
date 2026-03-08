import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/api-models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://localhost:3000/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Error fetching products'));
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error(`Error fetching product with ID ${id}:`, error);
        return throwError(() => new Error('Error fetching product'));
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Error creating product'));
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}`, product, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error(`Error updating product with ID ${id}:`, error);
        return throwError(() => new Error('Error updating product'));
      })
    );
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error(`Error deleting product with ID ${id}:`, error);
        return throwError(() => new Error('Error deleting product'));
      })
    );
  }
}
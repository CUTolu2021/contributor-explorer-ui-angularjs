import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private apiUrl = `${environment.apiUrl}/auth/login`;
  private githubLoginUrl = `${environment.apiUrl}/auth/github`;
  private validateUrl = `${environment.apiUrl}/auth/validate-token`;

  constructor(private http: HttpClient) {}


  loginRedirect(): void {
    window.location.href = this.githubLoginUrl; 
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
 
  login(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(this.apiUrl).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  validateToken(token: string): Observable<boolean> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any>(this.validateUrl, { headers }).pipe(
      tap(() => console.log('Token validation successful')),
      map(() => true),
      catchError(error => {
        console.error('Token validation failed:', error);
        return of(false);
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    role: 'tester' | 'admin';
  };
}

interface User {
  _id: string;
  email: string;
  role: 'tester' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('portfolio-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.clearStorage();
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AuthService error:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      url: error.url,
      message: error.message
    });

    if (error.status === 0) {
      // Client-side or network error
      return throwError(() => ({
        status: 0,
        message: 'Сервер недоступен. Проверьте подключение к интернету'
      }));
    }

    // Return the error as is for component to handle
    return throwError(() => error);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setUserAndToken(response.user, response.token);
        }),
        catchError(this.handleError)
      );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        tap(response => {
          this.setUserAndToken(response.user, response.token);
        }),
        catchError(this.handleError)
      );
  }

  private setUserAndToken(user: User, token: string): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('portfolio-user', JSON.stringify(user));
    localStorage.setItem('portfolio-token', token);
    console.log('User set:', user);
    console.log('Token saved:', token.substring(0, 20) + '...');
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.clearStorage();
    console.log('Logged out, tokens cleared');
  }

  private clearStorage(): void {
    localStorage.removeItem('portfolio-user');
    localStorage.removeItem('portfolio-token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('portfolio-token');
    const user = this.currentUserSubject.value;
    return !!token && !!user;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isTester(): boolean {
    const role = this.currentUserSubject.value?.role;
    return role === 'tester' || role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('portfolio-token');
  }
}

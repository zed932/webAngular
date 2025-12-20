import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../shared/models/app.model';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface ValidationErrorResponse {
  message: string;
  errors: { [key: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('portfolio-user');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.clearStorage();
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AuthService error:', error);

    if (error.status === 0) {
      // Client-side or network error
      return throwError(() => new Error('Отсутствует подключение к интернету или сервер недоступен'));
    }

    // Server-side error
    return throwError(() => error);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('portfolio-user', JSON.stringify(response.user));
          localStorage.setItem('portfolio-token', response.token);
          console.log('Login successful, token saved:', response.token);
        }),
        catchError(this.handleError)
      );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          localStorage.setItem('portfolio-user', JSON.stringify(response.user));
          localStorage.setItem('portfolio-token', response.token);
          console.log('Registration successful, token saved:', response.token);
        }),
        catchError(this.handleError)
      );
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
    // Проверяем наличие токена и пользователя
    const token = localStorage.getItem('portfolio-token');
    const user = this.currentUserSubject.value;
    return !!token && !!user;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Методы для проверки ролей
  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isTester(): boolean {
    const role = this.currentUserSubject.value?.role;
    return role === 'tester' || role === 'admin';
  }

  isGuest(): boolean {
    return !this.isAuthenticated();
  }

  getToken(): string | null {
    const token = localStorage.getItem('portfolio-token');
    return token;
  }
}

// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../../shared/models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Тестовые пользователи с ролями
  private testUsers = [
    { email: 'admin@test.com', password: 'admin123', role: 'admin' as const },
    { email: 'tester@test.com', password: 'test123', role: 'tester' as const },
    { email: 'example1@mail.ru', password: 'qwerty123', role: 'tester' as const },
    { email: 'example2@mail.ru', password: '12345678', role: 'tester' as const },
    { email: 'example3@mail.ru', password: 'asdfgh123', role: 'tester' as const }
  ];

  constructor() {
    const savedUser = localStorage.getItem('portfolio-user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const user = this.testUsers.find(u =>
          u.email === email && u.password === password
        );

        if (user) {
          const userInfo: User = { email: user.email, role: user.role };
          this.currentUserSubject.next(userInfo);
          localStorage.setItem('portfolio-user', JSON.stringify(userInfo));
          return true;
        }
        return false;
      })
    );
  }

  register(email: string, password: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const existingUser = this.testUsers.find(u => u.email === email);

        if (existingUser) {
          if (existingUser.password === password) {
            const userInfo: User = { email: existingUser.email, role: existingUser.role };
            this.currentUserSubject.next(userInfo);
            localStorage.setItem('portfolio-user', JSON.stringify(userInfo));
            return true;
          }
          return false;
        } else {
          // Новые пользователи по умолчанию становятся тестировщиками
          const newUser: User = { email, role: 'tester' };
          this.currentUserSubject.next(newUser);
          localStorage.setItem('portfolio-user', JSON.stringify(newUser));
          this.testUsers.push({ email, password, role: 'tester' });
          return true;
        }
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('portfolio-user');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
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
}

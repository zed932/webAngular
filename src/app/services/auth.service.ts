// Оставить этот auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('portfolio-user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    if (email && password) {
      const user: User = { email, isTester: true };
      this.currentUserSubject.next(user);
      localStorage.setItem('portfolio-user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(email: string, password: string): boolean {
    return this.login(email, password);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('portfolio-user');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}

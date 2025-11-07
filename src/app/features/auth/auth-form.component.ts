// src/app/components/auth-form/auth-form.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  isLoginMode = true;
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log(`Attempting ${this.isLoginMode ? 'login' : 'registration'} for:`, this.email);

    const authAction = this.isLoginMode
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    authAction.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (success) => {
        this.isLoading = false;
        console.log(`Auth ${this.isLoginMode ? 'login' : 'registration'} result:`, success);

        if (success) {
          const user = this.authService.getCurrentUser();
          if (user?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/tester']);
          }
        } else {
          this.errorMessage = this.isLoginMode
            ? 'Ошибка входа. Проверьте email и пароль.'
            : 'Ошибка регистрации.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Auth error:', error);
        this.errorMessage = 'Произошла ошибка при авторизации';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

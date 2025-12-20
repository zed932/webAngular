import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    email: string;
    role: 'guest' | 'tester' | 'admin';
  };
}

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
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  validationErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.validationErrors = {};
    this.confirmPassword = '';
  }

  validateForm(): boolean {
    this.validationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.validationErrors['email'] = 'Email обязателен';
    } else if (!emailRegex.test(this.email)) {
      this.validationErrors['email'] = 'Введите корректный email адрес';
    }

    // Password validation
    if (!this.password) {
      this.validationErrors['password'] = 'Пароль обязателен';
    } else if (this.password.length < 6) {
      this.validationErrors['password'] = 'Пароль должен содержать минимум 6 символов';
    }

    // Confirm password validation (only for registration)
    if (!this.isLoginMode) {
      if (!this.confirmPassword) {
        this.validationErrors['confirmPassword'] = 'Подтвердите пароль';
      } else if (this.password !== this.confirmPassword) {
        this.validationErrors['confirmPassword'] = 'Пароли не совпадают';
      }
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  onSubmit() {
    // Clear previous errors
    this.errorMessage = '';
    this.validationErrors = {};

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    console.log(`Attempting ${this.isLoginMode ? 'login' : 'registration'} for:`, this.email);

    const authAction = this.isLoginMode
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    authAction.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        console.log(`Auth ${this.isLoginMode ? 'login' : 'registration'} successful:`, response);

        // Успешная аутентификация
        const user = this.authService.getCurrentUser();
        console.log('Current user after auth:', user);

        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/tester']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Auth error:', error);

        // Проверка на отсутствие интернета
        if (!navigator.onLine) {
          this.errorMessage = 'Отсутствует подключение к интернету. Проверьте соединение и попробуйте позже.';
          return;
        }

        // Проверка на таймаут или недоступность сервера
        if (error.status === 0 || error.name === 'HttpErrorResponse') {
          this.errorMessage = 'Сервер временно недоступен. Пожалуйста, попробуйте позже.';
          return;
        }

        // Обработка HTTP ошибок
        if (error.status === 401) {
          this.errorMessage = 'Неверный email или пароль';
        } else if (error.status === 400) {
          if (this.isLoginMode) {
            this.errorMessage = 'Неверный email или пароль';
          } else {
            this.errorMessage = 'Пользователь с таким email уже существует';
          }
        } else if (error.status === 422) {
          // Обработка ошибок валидации с сервера
          if (error.error?.errors) {
            const serverErrors = error.error.errors;
            if (serverErrors.email) {
              this.validationErrors['email'] = serverErrors.email[0];
            }
            if (serverErrors.password) {
              this.validationErrors['password'] = serverErrors.password[0];
            }
          } else {
            this.errorMessage = error.error?.message || 'Ошибка валидации данных';
          }
        } else if (error.status >= 500) {
          this.errorMessage = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
        } else {
          this.errorMessage = error.error?.message || 'Произошла ошибка при авторизации';
        }
      }
    });
  }

  getErrorMessage(field: string): string {
    return this.validationErrors[field] || '';
  }

  onInputChange(field: string) {
    // Clear validation error for this field when user starts typing
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

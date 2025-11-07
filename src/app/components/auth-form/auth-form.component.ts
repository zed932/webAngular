import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent {
  isLoginMode = true;
  email = '';
  password = '';
  errorMessage = '';

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

    let success: boolean;

    if (this.isLoginMode) {
      success = this.authService.login(this.email, this.password);
    } else {
      success = this.authService.register(this.email, this.password);
    }

    if (success) {
      this.router.navigate(['/tester']);
    } else {
      this.errorMessage = 'Ошибка авторизации';
    }
  }
}

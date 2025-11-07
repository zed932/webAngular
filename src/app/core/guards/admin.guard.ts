import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      console.log('AdminGuard: Admin access granted');
      return true;
    } else {
      console.log('AdminGuard: Admin access denied, redirecting to home');
      this.router.navigate(['/']);
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isTester()) {
      console.log('AuthGuard: Tester access granted');
      return true;
    } else {
      console.log('AuthGuard: Access denied, redirecting to auth');
      this.router.navigate(['/auth']);
      return false;
    }
  }
}

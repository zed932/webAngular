import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/visiting-card.component').then(c => c.VisitingCardComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-form.component').then(c => c.AuthFormComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component').then(c => c.AdminPanelComponent),
    canActivate: [AuthGuard, AdminGuard], // Оба guard'а
  },
  {
    path: 'tester',
    loadComponent: () => import('./features/apps/app-list.component').then(c => c.AppListComponent),
    canActivate: [AuthGuard] // Только AuthGuard
  },
  { path: '**', redirectTo: '' }
];

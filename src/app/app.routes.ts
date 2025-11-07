import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/visiting-card/visiting-card.component').then(c => c.VisitingCardComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth-form/auth-form.component').then(c => c.AuthFormComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(c => c.AdminPanelComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'tester',
    loadComponent: () => import('./components/app-list/app-list.component').then(c => c.AppListComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { App, AdminApp } from '../models/app.model';
import { AdminStats } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private fakeApps: AdminApp[] = [
    {
      id: 1,
      name: 'Finance Tracker',
      version: '2.1.0',
      techStack: ['SwiftUI', 'Combine', 'Core Data', 'Charts'],
      minIOSVersion: 'iOS 15.0',
      supportsMacOS: true,
      description: 'Приложение для учета личных финансов с аналитикой и бюджетированием.',
      icon: '💰',
      isPublished: true,
      downloadCount: 1542,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Meditation Guide',
      version: '1.4.2',
      techStack: ['UIKit', 'AVFoundation', 'UserNotifications'],
      minIOSVersion: 'iOS 14.0',
      supportsMacOS: false,
      description: 'Гид по медитациям с таймером и отслеживанием прогресса.',
      icon: '🧘',
      isPublished: false,
      downloadCount: 892,
      rating: 4.5
    },
    {
      id: 3,
      name: 'Recipe Organizer',
      version: '3.0.1',
      techStack: ['SwiftUI', 'CloudKit', 'Camera API'],
      minIOSVersion: 'iOS 16.0',
      supportsMacOS: true,
      description: 'Организатор рецептов с синхронизацией между устройствами.',
      icon: '👨‍🍳',
      isPublished: true,
      downloadCount: 2107,
      rating: 4.9
    }
  ];

  getAdminApps(): Observable<AdminApp[]> {
    return of(this.fakeApps);
  }

  toggleAppPublish(appId: number): Observable<AdminApp | undefined> {
    const app = this.fakeApps.find(a => a.id === appId);
    if (app) {
      app.isPublished = !app.isPublished;
    }
    return of(app);
  }

  updateApp(appId: number, updates: Partial<AdminApp>): Observable<AdminApp> {
    const index = this.fakeApps.findIndex(a => a.id === appId);
    if (index !== -1) {
      this.fakeApps[index] = { ...this.fakeApps[index], ...updates };
      return of(this.fakeApps[index]);
    }
    throw new Error('App not found');
  }

  addApp(newApp: Omit<AdminApp, 'id'>): Observable<AdminApp> {
    const app: AdminApp = {
      ...newApp,
      id: Math.max(...this.fakeApps.map(a => a.id)) + 1
    };
    this.fakeApps.push(app);
    return of(app);
  }

  deleteApp(appId: number): Observable<boolean> {
    const index = this.fakeApps.findIndex(a => a.id === appId);
    if (index !== -1) {
      this.fakeApps.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getAdminStats(): Observable<AdminStats> {
    const stats: AdminStats = {
      totalApps: this.fakeApps.length,
      publishedApps: this.fakeApps.filter(app => app.isPublished).length,
      totalTesters: 3,
      activeTesters: 2,
      totalDownloads: this.fakeApps.reduce((sum, app) => sum + app.downloadCount, 0),
      averageRating: Number((this.fakeApps.reduce((sum, app) => sum + app.rating, 0) / this.fakeApps.length).toFixed(1))
    };
    return of(stats);
  }

  getApps(): Observable<App[]> {
    return of(this.fakeApps.filter(app => app.isPublished));
  }

  getAppById(id: number): Observable<App | undefined> {
    return of(this.fakeApps.find(app => app.id === id && app.isPublished));
  }
}

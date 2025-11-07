import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { App } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private fakeApps: App[] = [
    {
      id: 1,
      name: 'Finance Tracker',
      version: '2.1.0',
      techStack: ['SwiftUI', 'Combine', 'Core Data', 'Charts'],
      minIOSVersion: 'iOS 15.0',
      supportsMacOS: true,
      description: 'Приложение для учета личных финансов с аналитикой и бюджетированием.',
      icon: '💰'
    },
    {
      id: 2,
      name: 'Meditation Guide',
      version: '1.4.2',
      techStack: ['UIKit', 'AVFoundation', 'UserNotifications'],
      minIOSVersion: 'iOS 14.0',
      supportsMacOS: false,
      description: 'Гид по медитациям с таймером и отслеживанием прогресса.',
      icon: '🧘'
    },
    {
      id: 3,
      name: 'Recipe Organizer',
      version: '3.0.1',
      techStack: ['SwiftUI', 'CloudKit', 'Camera API'],
      minIOSVersion: 'iOS 16.0',
      supportsMacOS: true,
      description: 'Организатор рецептов с синхронизацией между устройствами.',
      icon: '👨‍🍳'
    }
  ];

  getApps() {
    return of(this.fakeApps);
  }

  getAppById(id: number) {
    return of(this.fakeApps.find(app => app.id === id));
  }
}

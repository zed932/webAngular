import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../core/services/app.service';

interface SimpleApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  version?: string;
  techStack?: string[];
  minIOSVersion?: string;
  supportsMacOS?: boolean;
  downloadCount?: number;
  rating?: number;
}

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  // Сигнал для списка приложений
  apps = signal<SimpleApp[]>([]);

  // Сигнал для управления деталями
  expandedAppId = signal<string | null>(null);

  // Computed свойство для отфильтрованных приложений
  filteredApps = computed(() => {
    return this.apps();
  });

  // Computed свойство для статистики
  appsStats = computed(() => {
    const appsList = this.apps();
    return {
      total: appsList.length,
      totalDownloads: appsList.reduce((sum, app) => sum + (app.downloadCount || 0), 0)
    };
  });

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.loadApps();
  }

  loadApps(): void {
    this.appService.getApps().subscribe({
      next: (apps: any[]) => {
        // Преобразуем к простой структуре
        const simpleApps: SimpleApp[] = apps.map(app => ({
          id: app._id || app.id || '',
          name: app.name || 'Без названия',
          description: app.description || 'Описание отсутствует',
          icon: app.icon || '📱',
          version: app.version || '1.0.0',
          techStack: app.techStack || ['Swift', 'SwiftUI'],
          minIOSVersion: app.minIOSVersion || 'iOS 15.0',
          supportsMacOS: app.supportsMacOS || false,
          downloadCount: app.downloadCount || 0,
          rating: app.rating || 0
        }));
        this.apps.set(simpleApps);
      },
      error: (error) => {
        console.error('Ошибка загрузки приложений:', error);
        // Заглушка для разработки
        this.apps.set([
          {
            id: '1',
            name: 'Finance Tracker',
            description: 'Умный трекер финансов с аналитикой расходов и доходов',
            icon: '💰',
            version: '1.2.0',
            techStack: ['SwiftUI', 'Core Data', 'Charts'],
            minIOSVersion: 'iOS 16.0',
            supportsMacOS: true,
            downloadCount: 1250,
            rating: 4.5
          },
          {
            id: '2',
            name: 'Meditation Guide',
            description: 'Помощник для ежедневных медитаций с таймерами и статистикой',
            icon: '🧘',
            version: '2.1.0',
            techStack: ['SwiftUI', 'AVFoundation', 'HealthKit'],
            minIOSVersion: 'iOS 15.0',
            supportsMacOS: false,
            downloadCount: 890,
            rating: 4.8
          }
        ]);
      }
    });
  }

  toggleAppDetails(appId: string): void {
    this.expandedAppId.update(currentId =>
      currentId === appId ? null : appId
    );
  }

  isExpanded(appId: string): boolean {
    return this.expandedAppId() === appId;
  }
}

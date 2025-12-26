import { Component, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { AdminApp, AdminStats, PublishStatus } from '../../shared/models/app.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private appService = inject(AppService);

  apps: AdminApp[] = [];
  stats: AdminStats = {
    totalApps: 0,
    publishedApps: 0,
    totalTesters: 0,
    activeTesters: 0,
    totalDownloads: 0,
    averageRating: 0
  };
  selectedApp: AdminApp | null = null;
  isEditing = false;
  isAdding = false;

  // Используем сигналы из сервиса
  isLoading = this.appService.isLoading;
  publishStatuses = this.appService.publishStatus;
  activePublishingCount = this.appService.activePublishingCount;

  // Локальный сигнал для поиска
  searchTerm: string = '';

  newApp: Partial<AdminApp> = {
    name: '',
    version: '1.0.0',
    techStack: [],
    minIOSVersion: 'iOS 15.0',
    supportsMacOS: false,
    description: '',
    icon: '📱',
    isPublished: false,
    downloadCount: 0,
    rating: 0
  };
  newTechStackItem = '';

  constructor() {
    // Эффект для отслеживания изменений статусов публикации
    effect(() => {
      const statuses = this.publishStatuses();
      console.log('Статусы публикации обновлены (через сигнал):', statuses);
    });

    // Эффект для отслеживания состояния загрузки
    effect(() => {
      const loading = this.isLoading();
      console.log('Состояние загрузки:', loading ? 'Загружается...' : 'Готово');
    });
  }

  ngOnInit() {
    this.loadData();

    // Старая подписка через Observable (оставляем для совместимости)
    this.appService.publishStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(statuses => {
        console.log('Статусы публикации (через Observable):', statuses);
      });
  }

  loadData() {
    this.appService.getAdminApps().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (apps) => {
        this.apps = apps;
      },
      error: (error) => {
        console.error('Ошибка загрузки приложений:', error);
      }
    });

    this.appService.getAdminStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe(stats => {
      this.stats = stats;
    });
  }

  getPublishStatus(appId: string): PublishStatus | undefined {
    return this.publishStatuses().find(s => s.appId === appId);
  }

  togglePublish(app: AdminApp) {
    if (this.getPublishStatus(app._id)?.status === 'publishing') {
      return;
    }

    this.appService.toggleAppPublish(app._id, app.isPublished).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedApp) => {
        if (updatedApp) {
          const index = this.apps.findIndex(a => a._id === updatedApp._id);
          if (index !== -1) {
            this.apps[index] = updatedApp;
          }
          this.loadStats();
        }
      },
      error: (error) => {
        console.error('Ошибка публикации:', error);
      }
    });
  }

  closeProgress(appId: string): void {
    this.appService.clearPublishStatus(appId);
  }

  editApp(app: AdminApp) {
    this.selectedApp = { ...app };
    this.selectedApp.techStack = [...app.techStack];
    this.isEditing = true;
    this.isAdding = false;
  }

  saveApp() {
    if (this.selectedApp) {
      const updateData = {
        name: this.selectedApp.name,
        version: this.selectedApp.version,
        techStack: this.selectedApp.techStack,
        minIOSVersion: this.selectedApp.minIOSVersion,
        supportsMacOS: this.selectedApp.supportsMacOS,
        description: this.selectedApp.description,
        icon: this.selectedApp.icon,
        isPublished: this.selectedApp.isPublished,
        downloadCount: this.selectedApp.downloadCount,
        rating: this.selectedApp.rating
      };

      this.appService.updateApp(this.selectedApp._id, updateData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedApp) => {
          const index = this.apps.findIndex(a => a._id === updatedApp._id);
          if (index !== -1) {
            this.apps[index] = updatedApp;
          }
          this.cancelEdit();
          this.loadStats();
        },
        error: (error) => {
          console.error('Ошибка обновления приложения:', error);
        }
      });
    }
  }

  addTechStackItem() {
    if (this.newTechStackItem.trim()) {
      if (this.selectedApp) {
        if (!this.selectedApp.techStack) {
          this.selectedApp.techStack = [];
        }
        this.selectedApp.techStack.push(this.newTechStackItem.trim());
        this.newTechStackItem = '';
      } else if (this.isAdding) {
        if (!this.newApp.techStack) {
          this.newApp.techStack = [];
        }
        this.newApp.techStack.push(this.newTechStackItem.trim());
        this.newTechStackItem = '';
      }
    }
  }

  removeTechStackItem(index: number) {
    if (this.selectedApp) {
      this.selectedApp.techStack.splice(index, 1);
    }
  }

  startAddApp() {
    this.isAdding = true;
    this.isEditing = false;
    this.newApp = {
      name: '',
      version: '1.0.0',
      techStack: [],
      minIOSVersion: 'iOS 15.0',
      supportsMacOS: false,
      description: '',
      icon: '📱',
      isPublished: false,
      downloadCount: 0,
      rating: 0
    };
  }

  saveNewApp() {
    this.appService.addApp(this.newApp as Omit<AdminApp, '_id'>).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (newApp) => {
        this.apps.push(newApp);
        this.cancelAdd();
        this.loadStats();
      },
      error: (error) => {
        console.error('Ошибка добавления приложения:', error);
      }
    });
  }

  cancelAdd() {
    this.isAdding = false;
    this.newApp = {
      name: '',
      version: '1.0.0',
      techStack: [],
      minIOSVersion: 'iOS 15.0',
      supportsMacOS: false,
      description: '',
      icon: '📱',
      isPublished: false,
      downloadCount: 0,
      rating: 0
    };
  }

  deleteApp(appId: string) {
    if (confirm('Вы уверены, что хотите удалить это приложение?')) {
      this.appService.deleteApp(appId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.apps = this.apps.filter(app => app._id !== appId);
          this.loadStats();
        },
        error: (error) => {
          console.error('Ошибка удаления приложения:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.selectedApp = null;
    this.isEditing = false;
  }

  private loadStats() {
    this.appService.getAdminStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe(stats => {
      this.stats = stats;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

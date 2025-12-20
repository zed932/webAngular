import { Component, OnInit, OnDestroy } from '@angular/core';
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
  isLoading = false;
  publishStatuses: PublishStatus[] = [];

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

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.loadData();

    this.appService.publishStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(statuses => {
        this.publishStatuses = statuses;
      });
  }

  loadData() {
    this.isLoading = true;

    this.appService.getAdminApps().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (apps) => {
        this.apps = apps;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.appService.getAdminStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe(stats => {
      this.stats = stats;
    });
  }

  getPublishStatus(appId: string): PublishStatus | undefined {
    return this.publishStatuses.find(s => s.appId === appId);
  }

  togglePublish(app: AdminApp) {
    if (this.getPublishStatus(app._id)?.status === 'publishing') {
      return;
    }

    this.appService.toggleAppPublish(app._id).pipe(
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
      error: () => {}
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
      this.appService.updateApp(this.selectedApp._id, this.selectedApp).pipe(
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
        error: () => {}
      });
    }
  }

  addTechStackItem() {
    if (this.newTechStackItem.trim() && this.selectedApp) {
      this.selectedApp.techStack.push(this.newTechStackItem.trim());
      this.newTechStackItem = '';
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
      error: () => {}
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
        error: () => {}
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

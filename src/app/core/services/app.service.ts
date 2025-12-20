import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { App, AdminApp, AdminStats, PublishStatus } from '../../shared/models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = 'http://localhost:3000/api';
  private publishStatusSubject = new BehaviorSubject<PublishStatus[]>([]);
  publishStatus$ = this.publishStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  getApps(): Observable<App[]> {
    return this.http.get<App[]>(`${this.apiUrl}/apps`);
  }

  getAppById(id: string): Observable<App> {
    return this.http.get<App>(`${this.apiUrl}/apps/${id}`);
  }

  getAdminApps(): Observable<AdminApp[]> {
    return this.http.get<AdminApp[]>(`${this.apiUrl}/admin/apps`);
  }

  toggleAppPublish(appId: string): Observable<AdminApp> {
    this.startPublishing(appId);

    return new Observable<AdminApp>(observer => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        this.updatePublishProgress(appId, progress);

        if (progress >= 100) {
          clearInterval(interval);
          this.http.patch<AdminApp>(`${this.apiUrl}/admin/apps/${appId}/publish`, {})
            .subscribe({
              next: (app) => {
                this.completePublishing(appId, 'success', 'Приложение успешно опубликовано!');
                observer.next(app);
                observer.complete();
              },
              error: (error) => {
                this.completePublishing(appId, 'error', 'Ошибка при публикации');
                observer.error(error);
              }
            });
        }
      }, 200);
    });
  }

  updateApp(appId: string, updates: Partial<AdminApp>): Observable<AdminApp> {
    return this.http.put<AdminApp>(`${this.apiUrl}/admin/apps/${appId}`, updates);
  }

  addApp(newApp: Omit<AdminApp, '_id'>): Observable<AdminApp> {
    return this.http.post<AdminApp>(`${this.apiUrl}/admin/apps`, newApp);
  }

  deleteApp(appId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/apps/${appId}`);
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`);
  }

  private startPublishing(appId: string): void {
    const currentStatus = this.publishStatusSubject.value;
    const existingIndex = currentStatus.findIndex(s => s.appId === appId);

    if (existingIndex >= 0) {
      currentStatus[existingIndex] = {
        appId,
        status: 'publishing',
        progress: 0,
        message: 'Начало публикации...'
      };
    } else {
      currentStatus.push({
        appId,
        status: 'publishing',
        progress: 0,
        message: 'Начало публикации...'
      });
    }

    this.publishStatusSubject.next([...currentStatus]);
  }

  private updatePublishProgress(appId: string, progress: number): void {
    const currentStatus = this.publishStatusSubject.value;
    const existingIndex = currentStatus.findIndex(s => s.appId === appId);

    if (existingIndex >= 0) {
      currentStatus[existingIndex] = {
        ...currentStatus[existingIndex],
        progress,
        message: `Публикация... ${progress}%`
      };
      this.publishStatusSubject.next([...currentStatus]);
    }
  }

  private completePublishing(appId: string, status: 'success' | 'error', message?: string): void {
    const currentStatus = this.publishStatusSubject.value;
    const existingIndex = currentStatus.findIndex(s => s.appId === appId);

    if (existingIndex >= 0) {
      currentStatus[existingIndex] = {
        appId,
        status,
        progress: 100,
        message
      };
      this.publishStatusSubject.next([...currentStatus]);

      setTimeout(() => {
        this.clearPublishStatus(appId);
      }, 3000);
    }
  }

  clearPublishStatus(appId: string): void {
    const currentStatus = this.publishStatusSubject.value;
    const filteredStatus = currentStatus.filter(s => s.appId !== appId);
    this.publishStatusSubject.next(filteredStatus);
  }
}

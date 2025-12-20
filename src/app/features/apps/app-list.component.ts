import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { App } from '../../shared/models/app.model';

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  apps: App[] = [];
  expandedAppId: string | null = null;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getApps().pipe(
      takeUntil(this.destroy$)
    ).subscribe(apps => {
      this.apps = apps;
    });
  }

  toggleAppDetails(appId: string) {
    this.expandedAppId = this.expandedAppId === appId ? null : appId;
  }

  isExpanded(appId: string): boolean {
    return this.expandedAppId === appId;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

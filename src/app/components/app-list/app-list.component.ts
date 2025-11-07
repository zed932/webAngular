import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { App } from '../../models/app.model';

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  apps: App[] = [];
  expandedAppId: number | null = null;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getApps().subscribe(apps => {
      this.apps = apps;
    });
  }

  toggleAppDetails(appId: number) {
    this.expandedAppId = this.expandedAppId === appId ? null : appId;
  }

  isExpanded(appId: number): boolean {
    return this.expandedAppId === appId;
  }
}

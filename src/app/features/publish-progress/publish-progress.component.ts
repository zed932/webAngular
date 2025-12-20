import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishStatus } from '../../shared/models/app.model';

@Component({
  selector: 'app-publish-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publish-progress.component.html',
  styleUrls: ['./publish-progress.component.css']
})
export class PublishProgressComponent {
  @Input() appId!: string;
  @Input() status?: PublishStatus;
  @Output() onClose = new EventEmitter<void>();

  getStatusTitle(): string {
    if (!this.status) return 'Публикация';

    switch (this.status.status) {
      case 'publishing':
        return 'Публикация приложения';
      case 'success':
        return 'Публикация успешна!';
      case 'error':
        return 'Ошибка публикации';
      default:
        return 'Публикация';
    }
  }
}

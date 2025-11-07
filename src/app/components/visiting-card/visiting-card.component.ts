import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-visiting-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visiting-card.component.html',
  styleUrls: ['./visiting-card.component.css']
})
export class VisitingCardComponent {
  developerInfo = {
    name: 'Сергей Мещеряков',
    position: 'iOS Developer',
    bio: 'Создаю качественные приложения для экосистемы Apple с 2025 года. Специализируюсь на SwiftUI, UIKit и современных подходах к разработке.',
    experience: '1 год учебных пет-проектов',
    email: 'mescheryakovsrg@gmail.com'
  };

  featuredApps = [
    {
      name: 'Finance Tracker',
      description: 'Умный трекер финансов с аналитикой',
      icon: '💰'
    },
    {
      name: 'Meditation Guide',
      description: 'Помощник для ежедневных медитаций',
      icon: '🧘'
    },
    {
      name: 'Recipe Organizer',
      description: 'Организатор ваших любимых рецептов',
      icon: '👨‍🍳'
    }
  ];
}

# 📁 Конфигурационные файлы Angular проекта

## ⚙️ **angular.json** - Главный конфигурационный файл

### Основная структура:
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "Lab4": {
      "projectType": "application",
      // ... конфигурация проекта
    }
  }
}
```

### Ключевые секции:

#### **Build Configuration**
```json
"build": {
  "builder": "@angular/build:application",
  "options": {
    "browser": "src/main.ts",           // Точка входа
    "polyfills": ["zone.js"],           // Полифилы для браузеров
    "tsConfig": "tsconfig.app.json",    // Конфиг TypeScript
    "assets": [{"glob": "**/*", "input": "public"}], // Статические файлы
    "styles": [                         // Глобальные стили
      "src/custom-theme.scss",
      "src/styles.css"
    ]
  }
}
```

#### **Production vs Development**
```json
"configurations": {
  "production": {
    "budgets": [                        // Лимиты размера бандла
      {"type": "initial", "maximumWarning": "500kB", "maximumError": "1MB"},
      {"type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB"}
    ],
    "outputHashing": "all"              // Хеширование файлов для кеша
  },
  "development": {
    "optimization": false,              // Без оптимизации для отладки
    "extractLicenses": false,
    "sourceMap": true                   // Карты источников для отладки
  }
}
```

#### **Development Server**
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "configurations": {
    "production": {
      "buildTarget": "Lab4:build:production"
    },
    "development": {
      "buildTarget": "Lab4:build:development"
    }
  },
  "defaultConfiguration": "development"
}
```

#### **Testing Setup**
```json
"test": {
  "builder": "@angular/build:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"], // Полифилы для тестов
    "tsConfig": "tsconfig.spec.json",
    "assets": [{"glob": "**/*", "input": "public"}],
    "styles": ["src/styles.css"]
  }
}
```

---

## 🎯 **main.ts** - Точка входа приложения

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Что происходит:
1. **Импорт зависимостей** - основные Angular модули
2. **bootstrapApplication()** - запуск standalone приложения
3. **AppComponent** - корневой компонент
4. **appConfig** - конфигурация провайдеров и сервисов
5. **Обработка ошибок** - отлов ошибок запуска

---

## 📝 **TypeScript Configuration Files**

### **tsconfig.json** - Базовый конфиг
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,                              // Строгий режим TS
    "noImplicitOverride": true,                  // Запрет неявного override
    "noPropertyAccessFromIndexSignature": true,  // Строгий доступ к свойствам
    "noImplicitReturns": true,                   // Все пути должны возвращать значение
    "noFallthroughCasesInSwitch": true,          // Запрет проваливания в switch
    "skipLibCheck": true,                        // Пропуск проверки библиотек
    "isolatedModules": true,                     // Совместимость с транспиляторами
    "experimentalDecorators": true,              // Поддержка декораторов Angular
    "importHelpers": true,                       // Оптимизация импортов
    "target": "ES2022",                          // Целевая версия JavaScript
    "module": "preserve"                         // Сохранение модулей ES
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,    // Современный формат i18n
    "strictInjectionParameters": true,           // Строгая типизация инъекций
    "strictInputAccessModifiers": true,          // Строгие модификаторы доступа
    "typeCheckHostBindings": true,               // Проверка типов в шаблонах
    "strictTemplates": true                      // Строгая типизация шаблонов
  },
  "files": [],
  "references": [
    {"path": "./tsconfig.app.json"},            // Ссылка на app конфиг
    {"path": "./tsconfig.spec.json"}            // Ссылка на test конфиг
  ]
}
```

### **tsconfig.app.json** - Для сборки приложения
```json
{
  "extends": "./tsconfig.json",                 // Наследование от базового
  "compilerOptions": {
    "outDir": "./out-tsc/app",                  // Выходная директория
    "types": []                                 // Типы для приложения
  },
  "include": ["src/**/*.ts"],                   // Включаемые файлы
  "exclude": ["src/**/*.spec.ts"]               // Исключаемые файлы (тесты)
}
```

### **tsconfig.spec.json** - Для тестирования
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",                 // Выходная директория для тестов
    "types": ["jasmine"]                        // Типы для Jasmine
  },
  "include": ["src/**/*.ts"]                    // Все TS файлы включая тесты
}
```

---

## 📦 **package.json** - Зависимости и скрипты

### **Scripts Section**
```json
"scripts": {
  "ng": "ng",                                   // Angular CLI
  "start": "ng serve",                         // Запуск dev сервера
  "build": "ng build",                         // Сборка проекта
  "watch": "ng build --watch --configuration development", // Сборка с отслеживанием
  "test": "ng test"                            // Запуск тестов
}
```

### **Dependencies** - Производственные зависимости
```json
"dependencies": {
  "@angular/animations": "^20.3.7",           // Анимации Angular
  "@angular/cdk": "^20.2.10",                 // Angular Component Dev Kit
  "@angular/common": "^20.3.0",               // Общие Angular утилиты
  "@angular/compiler": "^20.3.0",             // Компилятор Angular
  "@angular/core": "^20.3.0",                 // Ядро Angular
  "@angular/forms": "^20.3.0",                // Работа с формами
  "@angular/material": "^20.2.10",            // Angular Material UI
  "@angular/platform-browser": "^20.3.0",     // Рендеринг в браузере
  "@angular/router": "^20.3.0",               // Маршрутизация
  "json-server": "^1.0.0-beta.3",             // Mock API сервер
  "rxjs": "~7.8.0",                           // Реактивное программирование
  "tslib": "^2.3.0",                          // TypeScript утилиты
  "zone.js": "~0.15.0"                        // Зоны для change detection
}
```

### **Dev Dependencies** - Зависимости для разработки
```json
"devDependencies": {
  "@angular/build": "^20.3.7",                // Билд система Angular
  "@angular/cli": "^20.3.7",                  // Angular CLI
  "@angular/compiler-cli": "^20.3.0",         // Компилятор TypeScript для Angular
  "@types/jasmine": "~5.1.0",                 // Типы для Jasmine
  "jasmine-core": "~5.9.0",                   // Фреймворк для тестов
  "karma": "~6.4.0",                          // Test runner
  "karma-chrome-launcher": "~3.2.0",          // Запуск тестов в Chrome
  "karma-coverage": "~2.2.0",                 // Покрытие кода тестами
  "karma-jasmine": "~5.1.0",                  // Адаптер Jasmine для Karma
  "karma-jasmine-html-reporter": "~2.1.0",    // HTML репортер для тестов
  "typescript": "~5.9.2"                      // TypeScript компилятор
}
```

### **Prettier Configuration** - Форматирование кода
```json
"prettier": {
  "printWidth": 100,                          // Максимальная длина строки
  "singleQuote": true,                        // Использование одинарных кавычек
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"                   // Парсер для Angular шаблонов
      }
    }
  ]
}
```

---

## 🔧 **Как эти файлы работают вместе**

1. **Запуск `npm start`** → вызывает `ng serve` из package.json
2. **Angular CLI** читает angular.json для конфигурации сборки
3. **TypeScript компилятор** использует tsconfig.json для компиляции
4. **Dev сервер** собирает приложение согласно настройкам
5. **Приложение** запускается через main.ts

Эта конфигурация обеспечивает современную, типобезопасную среду разработки с поддержкой всех возможностей Angular 17+.

# 🏗️ **Основные файлы Angular приложения**

## 🎯 **main.ts** - Точка входа приложения

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Назначение и функциональность:
- **Точка входа** - первый файл, который выполняется при запуске приложения
- **Загрузка приложения** - инициализация Angular в браузере
- **Обработка ошибок** - отлов ошибок на этапе запуска

### Ключевые элементы:
- **`bootstrapApplication()`** - функция для запуска standalone приложения
- **`AppComponent`** - корневой компонент приложения
- **`appConfig`** - конфигурация провайдеров и сервисов

---

## ⚙️ **app.config.ts** - Конфигурация приложения

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};
```

### Назначение:
Конфигурация всех провайдеров и сервисов приложения в одном месте.

### Провайдеры:

#### **1. Маршрутизация**
```typescript
provideRouter(routes)
```
- Настройка системы маршрутизации Angular Router
- Использует маршруты из `app.routes.ts`

#### **2. Анимации**
```typescript
provideAnimations()
```
- Включает систему анимаций Angular
- Позволяет использовать анимации в компонентах

#### **3. HTTP клиент**
```typescript
provideHttpClient()
```
- Предоставляет HttpClient для HTTP запросов
- Включает интерцепторы и обработку ошибок

---

## 🗺️ **app.routes.ts** - Маршрутизация приложения

```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/visiting-card.component')
      .then(c => c.VisitingCardComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-form.component')
      .then(c => c.AuthFormComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component')
      .then(c => c.AdminPanelComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'tester',
    loadComponent: () => import('./features/apps/app-list.component')
      .then(c => c.AppListComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
```

### Структура маршрутов:

#### **1. Главная страница (`''`)**
- **Компонент**: `VisitingCardComponent`
- **Ленивая загрузка**: Да
- **Доступ**: Публичный

#### **2. Аутентификация (`/auth`)**
- **Компонент**: `AuthFormComponent`
- **Назначение**: Форма входа/регистрации

#### **3. Админ-панель (`/admin`)**
- **Компонент**: `AdminPanelComponent`
- **Защита**: `[AuthGuard, AdminGuard]`
- **Требования**: Аутентификация + права администратора

#### **4. Панель тестировщика (`/tester`)**
- **Компонент**: `AppListComponent`
- **Защита**: `[AuthGuard]`
- **Требования**: Аутентификация

#### **5. Wildcard маршрут (`**`)**
- **Редирект**: На главную страницу
- **Назначение**: Обработка несуществующих URL

### Ключевые особенности:

#### **Lazy Loading (Ленивая загрузка)**
```typescript
loadComponent: () => import('./path/to/component').then(c => c.ComponentName)
```
- **Оптимизация производительности** - компоненты загружаются только когда нужны
- **Уменьшение начального бандла** - главная страница загружается быстрее

#### **Route Guards (Защитники маршрутов)**
```typescript
canActivate: [AuthGuard, AdminGuard]
```
- **`AuthGuard`** - проверка аутентификации пользователя
- **`AdminGuard`** - проверка прав администратора
- **Порядок важен** - выполняются слева направо

---

## 🎨 **app.component.ts** - Корневой компонент

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iOS Developer Portfolio';

  constructor(public authService: AuthService) {}
}
```

### Архитектура компонента:

#### **Декоратор @Component**
```typescript
@Component({
  selector: 'app-root',                    // Селектор в HTML
  standalone: true,                       // Standalone компонент
  imports: [CommonModule, RouterModule],  // Импортируемые модули
  templateUrl: './app.component.html',    // Шаблон
  styleUrls: ['./app.component.css']      // Стили
})
```

#### **Импорты:**
- **`CommonModule`** - базовые Angular директивы (`*ngIf`, `*ngFor`)
- **`RouterModule`** - функциональность маршрутизации (`routerLink`, `router-outlet`)

#### **Зависимости:**
- **`AuthService`** - инжектирован через конструктор
- **`public` модификатор** - делает сервис доступным в шаблоне

### Роль в приложении:
- **Корневой компонент** - обертка для всего приложения
- **Навигация** - содержит общую навигационную панель
- **Layout** - определяет основную структуру страниц
- **Состояние аутентификации** - отображает разные элементы в зависимости от статуса пользователя

---

## 🧪 **app.spec.ts** - Unit тесты (временно отключены)

```typescript
// import { TestBed } from '@angular/core/testing';
// // import { App } from './app';
//
// describe('App', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [App],
//     }).compileComponents();
//   });
//
//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });
//
//   it('should render title', () => {
//     const fixture = TestBed.createComponent(App);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, PortfolioAngular');
//   });
// });
```

### Назначение:
- **Unit тестирование** - проверка корректности работы компонента
- **Jasmine framework** - фреймворк для написания тестов
- **Karma test runner** - запуск тестов в браузере

### Структура теста (закомментирована):
```typescript
describe('App', () => {                    // Test suite
  beforeEach(async () => {                 // Setup перед каждым тестом
    await TestBed.configureTestingModule({ // Конфигурация тестового модуля
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {      // Individual test
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();              // Assertion
  });
});
```

---

## 🔄 **Взаимодействие файлов при запуске**

### Последовательность инициализации:
1. **`main.ts`** → Запускает приложение
2. **`app.config.ts`** → Предоставляет конфигурацию
3. **`app.routes.ts`** → Настраивает маршрутизацию
4. **`app.component.ts`** → Рендерит корневой компонент
5. **Router** → Загружает соответствующий компонент по текущему URL

### Data Flow:
```
main.ts → app.config.ts → app.component.ts → Router → Feature Components
                    ↓
              app.routes.ts (маршруты)
```

Эта архитектура обеспечивает четкое разделение ответственности и легкость в поддержке кода. 

# 🔧 **Services и Guards - Бизнес-логика и безопасность**

## 🛡️ **Guards - Защитники маршрутов**

### **auth.guard.ts** - Защита аутентификации

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isTester()) {
      console.log('AuthGuard: Tester access granted');
      return true;
    } else {
      console.log('AuthGuard: Access denied, redirecting to auth');
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
```

### **admin.guard.ts** - Защита администратора

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      console.log('AdminGuard: Admin access granted');
      return true;
    } else {
      console.log('AdminGuard: Admin access denied, redirecting to home');
      this.router.navigate(['/']);
      return false;
    }
  }
}
```

## 🎯 **Назначение Guards**

### **AuthGuard**
- **Проверяет**: Является ли пользователь тестировщиком или администратором
- **Доступ**: `/tester` маршрут
- **Логика**: `isTester()` = тестировщик ИЛИ администратор
- **Редирект**: На страницу аутентификации (`/auth`)

### **AdminGuard**
- **Проверяет**: Является ли пользователь администратором
- **Доступ**: `/admin` маршрут
- **Логика**: `isAdmin()` = только администратор
- **Редирект**: На главную страницу (`/`)

## 🔐 **Использование в маршрутах**

```typescript
// Для тестировщиков - только AuthGuard
{
  path: 'tester',
  loadComponent: () => import('./features/apps/app-list.component').then(c => c.AppListComponent),
  canActivate: [AuthGuard]
}

// Для администраторов - оба Guard'а
{
  path: 'admin', 
  loadComponent: () => import('./features/admin/admin-panel.component').then(c => c.AdminPanelComponent),
  canActivate: [AuthGuard, AdminGuard]
}
```

**Порядок выполнения**: Слева направо → `AuthGuard` → `AdminGuard`

---

## 🔑 **AuthService - Сервис аутентификации**

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../../shared/models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Тестовые пользователи с ролями
  private testUsers = [
    { email: 'admin@test.com', password: 'admin123', role: 'admin' as const },
    { email: 'tester@test.com', password: 'test123', role: 'tester' as const },
    { email: 'example1@mail.ru', password: 'qwerty123', role: 'tester' as const },
    // ... другие пользователи
  ];
}
```

## 🏗️ **Архитектура AuthService**

### **Reactive State Management**
```typescript
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();
```

- **BehaviorSubject** - хранит текущее состояние пользователя
- **Observable** (`currentUser$`) - поток для подписки на изменения
- **Начальное значение**: `null` (пользователь не аутентифицирован)

### **Инициализация из Local Storage**
```typescript
constructor() {
  const savedUser = localStorage.getItem('portfolio-user');
  if (savedUser) {
    this.currentUserSubject.next(JSON.parse(savedUser));
  }
}
```

**Persistent Authentication** - пользователь остается авторизованным после перезагрузки страницы

## 🔐 **Методы аутентификации**

### **Логин**
```typescript
login(email: string, password: string): Observable<boolean> {
  return of(null).pipe(
    delay(500),  // Имитация задержки сети
    map(() => {
      const user = this.testUsers.find(u =>
        u.email === email && u.password === password
      );

      if (user) {
        const userInfo: User = { email: user.email, role: user.role };
        this.currentUserSubject.next(userInfo);
        localStorage.setItem('portfolio-user', JSON.stringify(userInfo));
        return true;
      }
      return false;
    })
  );
}
```

### **Регистрация**
```typescript
register(email: string, password: string): Observable<boolean> {
  return of(null).pipe(
    delay(500),
    map(() => {
      const existingUser = this.testUsers.find(u => u.email === email);

      if (existingUser) {
        // Если пользователь существует - проверяем пароль
        if (existingUser.password === password) {
          const userInfo: User = { email: existingUser.email, role: existingUser.role };
          this.currentUserSubject.next(userInfo);
          localStorage.setItem('portfolio-user', JSON.stringify(userInfo));
          return true;
        }
        return false;
      } else {
        // Новый пользователь - создаем с ролью тестировщика
        const newUser: User = { email, role: 'tester' };
        this.currentUserSubject.next(newUser);
        localStorage.setItem('portfolio-user', JSON.stringify(newUser));
        this.testUsers.push({ email, password, role: 'tester' });
        return true;
      }
    })
  );
}
```

### **Выход из системы**
```typescript
logout(): void {
  this.currentUserSubject.next(null);
  localStorage.removeItem('portfolio-user');
}
```

## 👥 **Методы проверки ролей**

```typescript
isAuthenticated(): boolean {
  return this.currentUserSubject.value !== null;
}

isAdmin(): boolean {
  return this.currentUserSubject.value?.role === 'admin';
}

isTester(): boolean {
  const role = this.currentUserSubject.value?.role;
  return role === 'tester' || role === 'admin';
}

isGuest(): boolean {
  return !this.isAuthenticated();
}
```

**Иерархия ролей**: Admin → Tester → Guest

---

## 📱 **AppService - Сервис управления приложениями**

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { App, AdminApp } from '../../shared/models/app.model';
import { AdminStats } from '../../shared/models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private fakeApps: AdminApp[] = [
    // Mock данные приложений
    {
      id: 1,
      name: 'Finance Tracker',
      version: '2.1.0',
      techStack: ['SwiftUI', 'Combine', 'Core Data', 'Charts'],
      // ... другие свойства
    }
    // ... другие приложения
  ];
}
```

## 🗃️ **Mock Data Structure**

### **AdminApp Interface**
```typescript
{
  id: number;                    // Уникальный идентификатор
  name: string;                  // Название приложения
  version: string;               // Версия (semantic versioning)
  techStack: string[];          // Технологический стек
  minIOSVersion: string;        // Минимальная версия iOS
  supportsMacOS: boolean;       // Поддержка macOS
  description: string;          // Описание приложения
  icon: string;                 // Emoji иконка
  isPublished: boolean;         // Опубликовано ли приложение
  downloadCount: number;        // Количество загрузок
  rating: number;               // Рейтинг (0-5)
}
```

## 🔄 **CRUD Operations**

### **Чтение данных**
```typescript
getAdminApps(): Observable<AdminApp[]> {
  return of(this.fakeApps);
}

getApps(): Observable<App[]> {
  return of(this.fakeApps.filter(app => app.isPublished));
}

getAppById(id: number): Observable<App | undefined> {
  return of(this.fakeApps.find(app => app.id === id && app.isPublished));
}
```

### **Обновление данных**
```typescript
toggleAppPublish(appId: number): Observable<AdminApp | undefined> {
  const app = this.fakeApps.find(a => a.id === appId);
  if (app) {
    app.isPublished = !app.isPublished;  // Переключение статуса публикации
  }
  return of(app);
}

updateApp(appId: number, updates: Partial<AdminApp>): Observable<AdminApp> {
  const index = this.fakeApps.findIndex(a => a.id === appId);
  if (index !== -1) {
    this.fakeApps[index] = { ...this.fakeApps[index], ...updates };  // Immutable update
    return of(this.fakeApps[index]);
  }
  throw new Error('App not found');
}
```

### **Создание данных**
```typescript
addApp(newApp: Omit<AdminApp, 'id'>): Observable<AdminApp> {
  const app: AdminApp = {
    ...newApp,
    id: Math.max(...this.fakeApps.map(a => a.id)) + 1  // Генерация нового ID
  };
  this.fakeApps.push(app);
  return of(app);
}
```

### **Удаление данных**
```typescript
deleteApp(appId: number): Observable<boolean> {
  const index = this.fakeApps.findIndex(a => a.id === appId);
  if (index !== -1) {
    this.fakeApps.splice(index, 1);  // Удаление из массива
    return of(true);
  }
  return of(false);
}
```

## 📊 **Статистика**
```typescript
getAdminStats(): Observable<AdminStats> {
  const stats: AdminStats = {
    totalApps: this.fakeApps.length,
    publishedApps: this.fakeApps.filter(app => app.isPublished).length,
    totalTesters: 3,  // Mock данные
    activeTesters: 2, // Mock данные
    totalDownloads: this.fakeApps.reduce((sum, app) => sum + app.downloadCount, 0),
    averageRating: Number((this.fakeApps.reduce((sum, app) => sum + app.rating, 0) 
      / this.fakeApps.length).toFixed(1))
  };
  return of(stats);
}
```

---

## 🎭 **Использование RxJS**

### **Pattern: Observable + Mock Delay**
```typescript
return of(data).pipe(delay(500));
```
- **Имитация реального API** - задержка 500ms
- **Consistent API** - всегда возвращает Observable
- **Легкая миграция** - легко заменить на реальный HTTP вызов

### **BehaviorSubject для State Management**
```typescript
// AuthService
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();
```

**Преимущества**:
- Единый источник истины для состояния пользователя
- Автоматические обновления для всех подписчиков
- Легкая интеграция с Angular (async pipe)

---

## 🔄 **Взаимодействие Services и Guards**

```
Компонент → AuthService → BehaviorSubject → Guards → Маршрутизация
    ↓
AppService → Mock Data → Компоненты
```

**Data Flow**:
1. Пользователь входит через `AuthFormComponent`
2. `AuthService` обновляет `BehaviorSubject`
3. `Guards` проверяют состояние через `AuthService`
4. `AppService` предоставляет данные для компонентов
5. Компоненты подписываются на изменения через `Observable`

Эта архитектура обеспечивает централизованное управление состоянием и безопасность маршрутов с четким разделением ответственности.

# 🎨 **Components - Презентационные компоненты приложения**

## 📊 **Модели данных (app.model.ts)**

```typescript
export interface App {
  id: number;
  name: string;
  version: string;
  techStack: string[];
  minIOSVersion: string;
  supportsMacOS: boolean;
  description: string;
  icon: string;
}

export interface User {
  email: string;
  role: 'guest' | 'tester' | 'admin';
}

export interface AdminApp extends App {
  isPublished: boolean;
  downloadCount: number;
  rating: number;
}

export interface AdminStats {
  totalApps: number;
  publishedApps: number;
  totalTesters: number;
  activeTesters: number;
  totalDownloads: number;
  averageRating: number;
}
```

### **Архитектура интерфейсов:**

#### **App - Базовая модель приложения**
- **Основные свойства**: название, версия, описание
- **Технические детали**: techStack, минимальная версия iOS, поддержка macOS
- **UI элементы**: иконка (emoji)

#### **AdminApp - Расширенная модель для администратора**
- **Наследует**: все свойства `App`
- **Добавляет**: бизнес-метрики (публикация, загрузки, рейтинг)
- **Использование**: админ-панель, статистика

#### **User - Модель пользователя**
- **Минималистичная**: только email и роль
- **Ролевая модель**: guest → tester → admin (иерархия)

#### **AdminStats - Статистика**
- **Метрики приложений**: количество, публикации
- **Метрики пользователей**: тестировщики
- **Бизнес-метрики**: загрузки, рейтинг

---

## 🏠 **VisitingCardComponent - Визитная карточка**

```typescript
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
```

### **Особенности компонента:**

#### **Статический компонент**
- **Нет внешних зависимостей** - не использует сервисы
- **Локальное состояние** - данные хранятся в компоненте
- **Простая логика** - только отображение информации

#### **Структура данных**
```typescript
developerInfo = {
  name: string;           // Имя разработчика
  position: string;       // Должность
  bio: string;           // Биография
  experience: string;    // Опыт работы
  email: string;         // Контактный email
};

featuredApps = [
  {
    name: string;        // Название приложения
    description: string; // Краткое описание
    icon: string;       // Emoji иконка
  }
];
```

#### **Импорты**
- **CommonModule** - базовые директивы Angular
- **RouterModule** - навигационные ссылки

**Назначение**: Главная страница портфолио, визитная карточка разработчика

---

## 📱 **AppListComponent - Список приложений для тестировщиков**

```typescript
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
  expandedAppId: number | null = null;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getApps().pipe(
      takeUntil(this.destroy$)
    ).subscribe(apps => {
      this.apps = apps;
    });
  }

  toggleAppDetails(appId: number) {
    this.expandedAppId = this.expandedAppId === appId ? null : appId;
  }

  isExpanded(appId: number): boolean {
    return this.expandedAppId === appId;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### **Ключевые особенности:**

#### **Управление подписками**
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.appService.getApps().pipe(
    takeUntil(this.destroy$)  // Автоматическая отписка
  ).subscribe(apps => {
    this.apps = apps;
  });
}

ngOnDestroy() {
  this.destroy$.next();      // Сигнал для отписки
  this.destroy$.complete();  // Очистка ресурсов
}
```

**Паттерн**: `takeUntil` для предотвращения memory leaks

#### **UI State Management**
```typescript
expandedAppId: number | null = null;

toggleAppDetails(appId: number) {
  this.expandedAppId = this.expandedAppId === appId ? null : appId;
}

isExpanded(appId: number): boolean {
  return this.expandedAppId === appId;
}
```

**Accordion Pattern**: только один элемент может быть раскрыт одновременно

#### **Data Flow**
- **Загрузка данных**: при инициализации компонента
- **Фильтрация**: только опубликованные приложения (`appService.getApps()`)
- **Отображение**: список с возможностью раскрытия деталей

**Назначение**: Интерфейс для тестировщиков - просмотр опубликованных приложений

---

## 🔐 **AuthFormComponent - Форма аутентификации**

```typescript
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  isLoginMode = true;
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ... методы компонента
}
```

### **Состояние компонента:**

```typescript
isLoginMode = true;      // Режим формы: вход/регистрация
email = '';              // Привязано к input через ngModel
password = '';           // Привязано к input через ngModel
errorMessage = '';       // Сообщение об ошибке
isLoading = false;       // Индикатор загрузки
```

### **Методы компонента:**

#### **Переключение режима**
```typescript
toggleMode() {
  this.isLoginMode = !this.isLoginMode;
  this.errorMessage = '';  // Сброс ошибки при переключении
}
```

#### **Обработка отправки формы**
```typescript
onSubmit() {
  // Валидация
  if (!this.email || !this.password) {
    this.errorMessage = 'Заполните все поля';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  // Выбор действия по режиму
  const authAction = this.isLoginMode
    ? this.authService.login(this.email, this.password)
    : this.authService.register(this.email, this.password);

  // Выполнение аутентификации
  authAction.pipe(
    takeUntil(this.destroy$)
  ).subscribe({
    next: (success) => {
      this.isLoading = false;
      
      if (success) {
        // Редирект по роли
        const user = this.authService.getCurrentUser();
        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/tester']);
        }
      } else {
        // Обработка ошибки аутентификации
        this.errorMessage = this.isLoginMode
          ? 'Ошибка входа. Проверьте email и пароль.'
          : 'Ошибка регистрации.';
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = 'Произошла ошибка при авторизации';
    }
  });
}
```

### **Архитектурные особенности:**

#### **Template-driven Forms**
- **FormsModule** - двухсторонняя привязка через `[(ngModel)]`
- **Простая валидация** - проверка заполненности полей

#### **Conditional Navigation**
```typescript
if (user?.role === 'admin') {
  this.router.navigate(['/admin']);
} else {
  this.router.navigate(['/tester']);
}
```

**Редирект на основе роли**: Admin → /admin, Tester → /tester

#### **Error Handling**
- **Валидация формы** - обязательные поля
- **Ошибки аутентификации** - неверные credentials
- **Системные ошибки** - проблемы с сетью/сервером

**Назначение**: Универсальная форма для входа и регистрации

---

## ⚙️ **AdminPanelComponent - Админ-панель**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { AdminApp, AdminStats } from '../../shared/models/app.model';

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
  stats: AdminStats = { /* ... */ };
  selectedApp: AdminApp | null = null;
  isEditing = false;
  isAdding = false;
  isLoading = false;

  newApp: Partial<AdminApp> = { /* ... */ };
  newTechStackItem = '';

  constructor(private appService: AppService) {}

  // ... много методов управления
}
```

### **Состояние компонента:**

```typescript
apps: AdminApp[] = [];           // Список всех приложений
stats: AdminStats;               // Статистика
selectedApp: AdminApp | null;    // Выбранное для редактирования
isEditing: boolean;              // Режим редактирования
isAdding: boolean;               // Режим добавления
isLoading: boolean;              // Загрузка данных
newApp: Partial<AdminApp>;       // Данные нового приложения
newTechStackItem: string;        // Новый элемент tech stack
```

### **Основные методы:**

#### **Загрузка данных**
```typescript
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
      // Обработка ошибки
    }
  });

  // Загрузка статистики
  this.appService.getAdminStats().pipe(
    takeUntil(this.destroy$)
  ).subscribe(stats => {
    this.stats = stats;
  });
}
```

#### **Управление публикацией**
```typescript
togglePublish(app: AdminApp) {
  this.appService.toggleAppPublish(app.id).pipe(
    takeUntil(this.destroy$)
  ).subscribe(updatedApp => {
    if (updatedApp) {
      app.isPublished = updatedApp.isPublished;
      this.loadStats();  // Обновление статистики
    }
  });
}
```

#### **CRUD операции**
```typescript
// Редактирование
editApp(app: AdminApp) {
  this.selectedApp = { ...app };                    // Копирование объекта
  this.selectedApp.techStack = [...app.techStack]; // Копирование массива
  this.isEditing = true;
  this.isAdding = false;
}

// Сохранение изменений
saveApp() {
  if (this.selectedApp) {
    this.appService.updateApp(this.selectedApp.id, this.selectedApp).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedApp) => {
        const index = this.apps.findIndex(a => a.id === updatedApp.id);
        if (index !== -1) {
          this.apps[index] = updatedApp;  // Обновление в локальном массиве
        }
        this.cancelEdit();
        this.loadStats();
      }
    });
  }
}

// Добавление
startAddApp() {
  this.isAdding = true;
  this.isEditing = false;
  this.newApp = { /* значения по умолчанию */ };
}

// Удаление
deleteApp(appId: number) {
  if (confirm('Вы уверены, что хотите удалить это приложение?')) {
    this.appService.deleteApp(appId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (success) => {
        if (success) {
          this.apps = this.apps.filter(app => app.id !== appId);
          this.loadStats();
        }
      }
    });
  }
}
```

#### **Управление Tech Stack**
```typescript
addTechStackItem() {
  if (this.newTechStackItem.trim() && this.selectedApp) {
    this.selectedApp.techStack.push(this.newTechStackItem.trim());
    this.newTechStackItem = '';  // Очистка поля ввода
  }
}

removeTechStackItem(index: number) {
  if (this.selectedApp) {
    this.selectedApp.techStack.splice(index, 1);
  }
}
```

### **Архитектурные паттерны:**

#### **Immutable Updates**
```typescript
this.selectedApp = { ...app };
this.selectedApp.techStack = [...app.techStack];
```
**Принцип**: Не мутировать исходные объекты, создавать копии

#### **State Management через Флаги**
```typescript
isEditing: boolean;
isAdding: boolean;
```
**Управление UI**: разные состояния интерфейса (список, редактирование, добавление)

#### **Error Handling Pattern**
```typescript
.subscribe({
  next: (data) => { /* успех */ },
  error: () => { /* обработка ошибки */ }
})
```
**Единообразие**: одинаковый подход ко всем HTTP операциям

**Назначение**: Полнофункциональная админ-панель для управления приложениями

---

## 🎯 **Сравнение компонентов**

| Компонент | Назначение | Состояние | Зависимости |
|-----------|------------|-----------|-------------|
| **VisitingCard** | Визитка | Статическое | Нет |
| **AppList** | Просмотр приложений | Динамическое + UI | AppService |
| **AuthForm** | Аутентификация | Форма + загрузка | AuthService, Router |
| **AdminPanel** | Управление | Комплексное состояние | AppService |

### **Общие паттерны:**

1. **Standalone Components** - все компоненты независимы
2. **Reactive Unsubscription** - `takeUntil` для отписки
3. **Service Injection** - бизнес-логика в сервисах
4. **Type Safety** - строгая типизация через интерфейсы
5. **Lifecycle Hooks** - правильное управление ресурсами

Эта архитектура обеспечивает четкое разделение ответственности и легкость в поддержке кода.

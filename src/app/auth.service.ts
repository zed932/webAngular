import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dbUrl = 'assets/db.json'; // Путь к твоему JSON файлу

  constructor(private http: HttpClient) {}

  checkUser(email: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.get<{users: User[]}>(this.dbUrl).subscribe({
        next: (data) => {
          const user = data.users.find(u =>
            u.email === email && u.password === password
          );

          if (user) {
            observer.next({
              success: true,
              user: user,
              message: 'Вы успешно вошли!'
            });
          } else {
            observer.next({
              success: false,
              message: 'Вы не зарегистрированы'
            });
          }
          observer.complete();
        },
        error: (error) => {
          observer.next({
            success: false,
            message: 'Ошибка при проверке данных'
          });
          observer.complete();
        }
      });
    });
  }
}

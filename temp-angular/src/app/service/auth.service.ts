import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://localhost:8080/auth';

  // Global user state
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restore user from localStorage on app start
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.userSubject.next(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  // LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
          this.userSubject.next(res);
        })
      );
  }

  // REGISTER
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/register`, userData);
  }

  // GET CURRENT USER
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // SET USER (useful for mock/dev)
  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value || !!localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { id: 1, userId: 'admin', password: 'admin123', role: 'Admin', name: 'Admin User' },
    { id: 2, userId: 'user', password: 'user123', role: 'General User', name: 'General User' }
  ];

  private currentUser: User | null = null;

  login(userId: string, password: string): Observable<User | null> {
    const user = this.users.find(u => u.userId === userId && u.password === password);
    if (user) {
      this.currentUser = user;
      return of(user).pipe(delay(1000)); // Simulating API delay
    }
    return of(null).pipe(delay(1000));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }
}
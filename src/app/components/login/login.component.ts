import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>User ID:</label>
          <input type="text" [(ngModel)]="userId" name="userId" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .error { color: red; }
    input { margin: 10px 0; padding: 5px; width: 100%; }
    button { width: 100%; padding: 10px; margin-top: 10px; }
  `]
})
export class LoginComponent {
  userId = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.userId, this.password).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid credentials';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'An error occurred';
        this.loading = false;
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecordsService } from '../../services/records.service';
import { User, Record } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="user-info">
        <h2>Welcome, {{ currentUser?.name }}</h2>
        <p>Role: {{ currentUser?.role }}</p>
        <button (click)="logout()">Logout</button>
      </div>

      <div class="records-section">
        <h3>Records</h3>
        <div *ngIf="loading" class="loading">Loading records...</div>
        <table *ngIf="!loading && records.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>User ID</th>
              <th *ngIf="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records">
              <td>{{ record.id }}</td>
              <td>{{ record.title }}</td>
              <td>{{ record.description }}</td>
              <td>{{ record.userId }}</td>
              <td *ngIf="isAdmin">
                <button 
                  (click)="deleteRecord(record.id)"
                  [disabled]="deletingId === record.id"
                  class="delete-btn"
                >
                  {{ deletingId === record.id ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!loading && !records.length">No records found.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .user-info {
      margin-bottom: 20px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th { background: #f5f5f5; }
    .loading { padding: 20px; }
    .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-btn:disabled {
      background-color: #f1a3ab;
      cursor: not-allowed;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  records: Record[] = [];
  loading = true;
  isAdmin = false;
  deletingId: number | null = null;

  constructor(
    private authService: AuthService,
    private recordsService: RecordsService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.isAdmin = this.currentUser.role === 'Admin';
    }
  }

  ngOnInit() {
    if (this.currentUser) {
      this.loadRecords();
    }
  }

  loadRecords() {
    this.loading = true;
    this.recordsService
      .getRecords(
        this.currentUser!.id,
        this.isAdmin
      )
      .subscribe(records => {
        this.records = records;
        this.loading = false;
      });
  }

  deleteRecord(id: number) {
    if (!this.isAdmin) return;
    
    this.deletingId = id;
    this.recordsService.deleteRecord(id).subscribe({
      next: (success) => {
        if (success) {
          this.records = this.records.filter(record => record.id !== id);
        }
        this.deletingId = null;
      },
      error: () => {
        this.deletingId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
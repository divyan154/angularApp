import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecordsService } from '../../services/records.service';
import { User, Record } from '../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  records: Record[] = [];
  filteredRecords: Record[] = [];
  loading = true;
  isAdmin = false;
  deletingId: number | null = null;
  searchTerm = '';
  sortBy = 'title';
  lastLoginTime = new Date();

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
      const lastLogin = localStorage.getItem('lastLoginTime');
      console.log(lastLogin);
      if (lastLogin) {
        this.lastLoginTime = new Date(lastLogin);
      }
      localStorage.setItem('lastLoginTime', new Date().toISOString());
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
        this.filterRecords();
        this.loading = false;
      });
  }

  filterRecords() {
    this.filteredRecords = this.records.filter(record =>
      record.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortRecords();
  }

  sortRecords() {
    this.filteredRecords.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'id') {
        return a.id - b.id;
      } else {
        return a.userId - b.userId;
      }
    });
  }

  deleteRecord(id: number) {
    if (!this.isAdmin) return;
    
    this.deletingId = id;
    this.recordsService.deleteRecord(id).subscribe({
      next: (success) => {
        if (success) {
          this.records = this.records.filter(record => record.id !== id);
          this.filterRecords();
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

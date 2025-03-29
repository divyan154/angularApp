import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Record } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private records: Record[] = [
    { id: 1, title: 'Record 1', description: 'Description 1', userId: 1 },
    { id: 2, title: 'Record 2', description: 'Description 2', userId: 2 },
    { id: 3, title: 'Record 3', description: 'Description 3', userId: 1 },
    { id: 4, title: 'Project Report', description: 'Q4 Financial Analysis', userId: 1 },
    { id: 5, title: 'Meeting Minutes', description: 'Board Meeting Summary', userId: 2 },
    { id: 6, title: 'Sales Data', description: 'Monthly Sales Statistics', userId: 1 },
    { id: 7, title: 'User Feedback', description: 'Customer Survey Results', userId: 2 },
    { id: 8, title: 'Inventory List', description: 'Current Stock Status', userId: 1 },
    { id: 9, title: 'Employee Schedule', description: 'Work Rotation Plan', userId: 2 }
  ];

  getRecords(userId: number, isAdmin: boolean): Observable<Record[]> {
    const filteredRecords = isAdmin 
      ? this.records 
      : this.records.filter(r => r.userId === userId);
    return of(filteredRecords).pipe(delay(2000)); // Simulating API delay
  }

  deleteRecord(id: number): Observable<boolean> {
    const initialLength = this.records.length;
    this.records = this.records.filter(record => record.id !== id);
    return of(this.records.length !== initialLength).pipe(delay(1000)); // Simulating API delay
  }
}
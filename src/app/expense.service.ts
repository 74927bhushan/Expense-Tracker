import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  id?: number;
  date: string;
  type: string;
  amount: string;
  remark?: string;
  category?:string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/excel/expense';

  constructor(private http: HttpClient) {}

  getExpense(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Income {
    id?: number;
    date: string;
    total: string;
    remark: string;
  type?:string
}

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'http://localhost:8080/api/excel/income';

  constructor(private http: HttpClient) {}

  getIncome(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl);
  }
}
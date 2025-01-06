import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
   private incomeDataUpdated = new Subject<void>();
     incomeDataUpdated$ = this.incomeDataUpdated.asObservable();
    
  private expenseDataUpdated = new Subject<void>();
   expenseDataUpdated$ = this.expenseDataUpdated.asObservable();


  triggerIncomeDataUpdate() {
        this.incomeDataUpdated.next();
    }
    triggerExpenseDataUpdate() {
       this.expenseDataUpdated.next();
    }
}
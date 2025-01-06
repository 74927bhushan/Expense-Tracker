import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../shared-table/shared-table.component';
import { ExpenseService, Expense } from '../expense.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-expense-table',
    templateUrl: './expense-table.component.html',
    styleUrls: ['./expense-table.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, SharedTableComponent]
})
export class ExpenseTableComponent implements OnInit, OnDestroy {
    expenseData: Expense[] = [];
    columns: string[] = ['Type', 'Date', 'Amount'];
   private dataSubscription!: Subscription;
    constructor(private expenseService: ExpenseService, private dataService: DataService) { }

    ngOnInit(): void {
       this.loadExpense();
      this.dataSubscription = this.dataService.expenseDataUpdated$.subscribe(()=>{
        this.loadExpense();
      })
   }
    ngOnDestroy(): void {
     if(this.dataSubscription){
         this.dataSubscription.unsubscribe();
       }
     }
    loadExpense() {
        this.expenseService.getExpense().subscribe((data) => {
           this.expenseData = data;
        });
    }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../shared-table/shared-table.component';
import { IncomeService, Income } from '../income.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-income-table',
    templateUrl: './income-table.component.html',
    styleUrls: ['./income-table.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, SharedTableComponent]
})
export class IncomeTableComponent implements OnInit, OnDestroy {
    incomeData: Income[] = [];
     columns: string[] = ['Date', 'total', 'Remark'];
    private dataSubscription!: Subscription;
    constructor(private incomeService: IncomeService, private dataService: DataService) { }

    ngOnInit(): void {
      this.loadIncome();
      this.dataSubscription = this.dataService.incomeDataUpdated$.subscribe(()=>{
        this.loadIncome();
      })
   }
    ngOnDestroy(): void {
     if(this.dataSubscription){
         this.dataSubscription.unsubscribe();
       }
     }

   loadIncome() {
        this.incomeService.getIncome().subscribe((data) => {
            this.incomeData = data;
        });
    }
}
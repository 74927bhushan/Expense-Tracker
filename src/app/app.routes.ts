import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeTableComponent } from './income-table/income-table.component';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

export const routes: Routes = [
  { path: 'income', component: IncomeTableComponent },
  { path: 'expense', component: ExpenseTableComponent },
    { path: 'upload', component: FileUploadComponent },
  { path: '', redirectTo: '/upload', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
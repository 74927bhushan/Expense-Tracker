import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeTableComponent } from '../income-table/income-table.component';
import { ExpenseTableComponent } from '../expense-table/expense-table.component';
import { FileUploadService } from '../file-upload.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { IncomeService } from '../income.service';
import { ExpenseService } from '../expense.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, IncomeTableComponent, ExpenseTableComponent, NgxChartsModule]
})
export class FileUploadComponent implements AfterViewInit, OnDestroy {
    @ViewChild('incomeTable') incomeTable!: IncomeTableComponent;
    @ViewChild('expenseTable') expenseTable!: ExpenseTableComponent;
    @ViewChild('fileInput') fileInput!: ElementRef;

    fileToUpload: File | null = null;
    incomeTableCount: number = 0;
    expenseTableCount: number = 0;
    incomeLocations: string[] = [];
    expenseLocations: string[] = [];
    errorMessage: string = '';
    isValid: boolean = false;
    isUploading: boolean = false;
    showCharts: boolean = false;

    // Pie chart variables
    chartColors: string[] = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9FA8DA', '#90CAF9', '#A5D6A7', '#FFCC80'
    ];

    view: [number, number] = [400, 300];
    showLegend = true;
    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    gradient = true;

    incomeChartData: any[] = [];
    expenseChartData: any[] = [];

    private dataSubscription!: Subscription;

    constructor(
        private fileUploadService: FileUploadService,
        private dataService: DataService,
        private incomeService: IncomeService,
        private expenseService: ExpenseService
    ) { }

    ngAfterViewInit(): void {
        this.loadData();
        this.dataSubscription = this.dataService.incomeDataUpdated$.subscribe(() => {
            this.updateChartData();
        });
        this.dataSubscription = this.dataService.expenseDataUpdated$.subscribe(() => {
            this.updateChartData();
        });
    }

    ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    loadData() {
        if (this.incomeTable) {
            this.incomeTable.loadIncome();
        }
        if (this.expenseTable) {
            this.expenseTable.loadExpense();
        }
        this.updateChartData();
    }

    updateChartData() {
        this.incomeChartData = [];
        this.expenseChartData = [];
        this.showCharts = false;

        this.incomeService.getIncome().subscribe(incomeData => {
            if (incomeData && incomeData.length > 0) {
                this.processIncomeChartData(incomeData);
                this.showCharts = true;
            }
        });
        this.expenseService.getExpense().subscribe(expenseData => {
            if (expenseData && expenseData.length > 0) {
                this.processExpenseChartData(expenseData);
                this.showCharts = true;
            }
        });
    }
      private processIncomeChartData(incomeData: any[]) {
        const incomeMap = new Map<string, number>();
        incomeData.forEach((income: any) => {
            if (income.remark && income.total) {
                const remark = income.remark.trim();
                const total = parseFloat(income.total);
                if (!isNaN(total)) {
                    if (incomeMap.has(remark)) {
                        incomeMap.set(remark, incomeMap.get(remark)! + total);
                    } else {
                        incomeMap.set(remark, total);
                    }
                }
            }
        });

        this.incomeChartData = Array.from(incomeMap.entries())
            .map(([name, value], index) => ({
                name: name,
                value: Math.round(value * 100) / 100,
                color: this.chartColors[index % this.chartColors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }


    private processExpenseChartData(expenseData: any[]) {
        const expenseMap = new Map<string, number>();
        expenseData.forEach((expense: any) => {
            if (expense.type && expense.amount) {
                const type = expense.type.trim();
                const amount = parseFloat(expense.amount);
                if (!isNaN(amount)) {
                    if (expenseMap.has(type)) {
                        expenseMap.set(type, expenseMap.get(type)! + amount);
                    } else {
                        expenseMap.set(type, amount);
                    }
                }
            }
        });

        this.expenseChartData = Array.from(expenseMap.entries())
            .map(([name, value], index) => ({
                name: name,
                value: Math.round(value * 100) / 100,
                color: this.chartColors[index % this.chartColors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }

    onFileSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];

            // Check file extension
            const validExtensions = ['.xlsx', '.xls'];
            const hasValidExtension = validExtensions.some(ext =>
                file.name.toLowerCase().endsWith(ext)
            );

            if (!hasValidExtension) {
                this.errorMessage = 'Please select a valid Excel file (.xlsx or .xls)';
                this.fileToUpload = null;
                this.isValid = false;
                if (this.fileInput) {
                    this.fileInput.nativeElement.value = '';
                }
                return;
            }

            this.fileToUpload = file;
            this.errorMessage = '';
            this.validateForm();
            console.log('File selected:', this.fileToUpload.name);
        } else {
            this.fileToUpload = null;
            this.isValid = false;
        }
    }

    updateLocationsArrays() {
        // Ensure non-negative values
        this.incomeTableCount = Math.max(0, this.incomeTableCount);
        this.expenseTableCount = Math.max(0, this.expenseTableCount);

        // Resize arrays while preserving existing values
        this.incomeLocations = this.incomeLocations
            .slice(0, this.incomeTableCount)
            .concat(Array(Math.max(0, this.incomeTableCount - this.incomeLocations.length)).fill(''));

        this.expenseLocations = this.expenseLocations
            .slice(0, this.expenseTableCount)
            .concat(Array(Math.max(0, this.expenseTableCount - this.expenseLocations.length)).fill(''));

        this.validateForm();
    }

    validateForm() {
        // Log initial state
        console.log('Starting validation with:', {
            fileToUpload: this.fileToUpload?.name,
            incomeCount: this.incomeTableCount,
            expenseCount: this.expenseTableCount,
            incomeLocations: this.incomeLocations,
            expenseLocations: this.expenseLocations
        });

        // Check if file is selected
        if (!this.fileToUpload) {
            this.errorMessage = 'Please select an Excel file';
            this.isValid = false;
            return;
        }

        // Check if at least one table is specified
        if (this.incomeTableCount === 0 && this.expenseTableCount === 0) {
            this.errorMessage = 'Please specify at least one table';
            this.isValid = false;
            return;
        }

        // Validate income locations if any are required
        let validIncomeLocations = true;
        if (this.incomeTableCount > 0) {
            validIncomeLocations = this.incomeLocations.length === this.incomeTableCount &&
                this.incomeLocations.every(loc => loc && loc.trim() !== '');
        }

        // Validate expense locations if any are required
        let validExpenseLocations = true;
        if (this.expenseTableCount > 0) {
            validExpenseLocations = this.expenseLocations.length === this.expenseTableCount &&
                this.expenseLocations.every(loc => loc && loc.trim() !== '');
        }

        // Update validation state
        this.isValid = validIncomeLocations && validExpenseLocations && this.fileToUpload !== null;

        // Set error message if needed
        if (!this.isValid) {
            if (!validIncomeLocations) {
                this.errorMessage = 'Please fill all income table locations';
            } else if (!validExpenseLocations) {
                this.errorMessage = 'Please fill all expense table locations';
            }
        } else {
            this.errorMessage = '';
        }

        // Log validation results
        console.log('Validation result:', {
            isValid: this.isValid,
            validIncomeLocations,
            validExpenseLocations,
            errorMessage: this.errorMessage
        });
    }

    isLocationValid(location: string): boolean {
        if (!location) return false;
        return location.trim() !== '';
    }

    uploadFile() {
        if (!this.fileToUpload || !this.isValid || this.isUploading) {
            return;
        }

        this.isUploading = true;
        this.errorMessage = '';

        const formData = new FormData();
        formData.append('file', this.fileToUpload);

        // Convert locations to a format Spring can parse better
        if (this.incomeLocations.length > 0) {
            this.incomeLocations.forEach((location, index) => {
                formData.append('incomeLocations', location.trim());
            });
        } else {
            // Ensure at least an empty array is sent
            formData.append('incomeLocations', '');
        }

        if (this.expenseLocations.length > 0) {
            this.expenseLocations.forEach((location, index) => {
                formData.append('expenseLocations', location.trim());
            });
        } else {
            // Ensure at least an empty array is sent
            formData.append('expenseLocations', '');
        }

        this.fileUploadService.uploadExcel(formData).subscribe({
            next: (response: any) => {
                console.log('Upload successful:', response);
                this.loadData();
                this.resetForm();
            },
            error: (err) => {
                console.error('Upload error: There is either a problem with the location of cell you provided or the file you uploaded check cell number and column name', err);
                // More detailed error message
                if (err.error && typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else if (err.error?.message) {
                    this.errorMessage = err.error.message;
                } else {
                    this.errorMessage = ' Error uploading file ! There is either a problem with the location of cell you provided or the file you uploaded .  Please Check cell number and column-name and try to upload the valid file again.  ';
                }
                this.isUploading = false;
            },
            complete: () => {
                this.isUploading = false;
            }
        });
    }

    private resetForm() {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
        this.fileToUpload = null;
        this.incomeLocations = [];
        this.expenseLocations = [];
        this.incomeTableCount = 0;
        this.expenseTableCount = 0;
        this.errorMessage = '';
        this.isValid = false;
        this.isUploading = false;
    }

    getLocationPlaceholder(index: number): string {
        return `e.g., ${String.fromCharCode(65 + index)}7`;
    }

    createArray(count: number): any[] {
        return Array(count).fill(0);
    }
}
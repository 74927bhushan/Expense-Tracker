import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SharedTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor() {}

  ngOnInit(): void {
    this.calculateTotalPages();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.data.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.calculateTotalPages();
  }
}

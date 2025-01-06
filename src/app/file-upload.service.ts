import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8080/api/excel';

  constructor(private http: HttpClient) {}

  uploadExcel(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/import`, formData, {
          reportProgress: true,
          responseType: 'json'
      });
  }
}
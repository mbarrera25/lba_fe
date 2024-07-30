import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { iTest } from 'src/app/models/Test.model';
import { Page } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://localhost:5000/api';
  listExamenes$ = new BehaviorSubject<iTest[] | null>(null);

 private listExamenesSubscription!: Subscription;

 private page: Page ={ page: 1, size: 10}
  constructor(
    private http: HttpClient
  ) {

  }
 getAllExamenes(page: Page) {
    return this.http.get<iTest[]>(`${this.apiUrl}/tests?page=${page.page}&size=${page.size}`);
  }

}

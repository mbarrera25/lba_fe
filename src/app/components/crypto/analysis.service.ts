import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { iTest, Test } from 'src/app/models/Test.model';
import { Page, Pagination } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {



  private apiUrl = 'http://localhost:5000/api';
  listExamenes$ = new BehaviorSubject<iTest[] | null>(null);
  pagination$ = new BehaviorSubject<Pagination | null>(null);
 private listExamenesSubscription!: Subscription;

 private page: Page ={ page: 1, size: 10}
  constructor(
    private http: HttpClient
  ) {

  }

  getallTest(){
    this
      .getAllExamenes({ page: 1, size: 10 })
      .pipe(
        tap((res: any) => {
          this.listExamenes$.next(res.data)
          this.pagination$.next(res.meta)
        })
      )
      .subscribe();
  }
 getAllExamenes(page: Page) {
    return this.http.get<iTest[]>(`${this.apiUrl}/tests?page=${page.page}&size=${page.size}`);
  }


  saveTest(test: Test) {
    return this.http.post<iTest>(`${this.apiUrl}/tests`, test)
  }

  delete(test: Test) {
    return this.http.delete(`${this.apiUrl}/tests/${test.id}`,)
  }

  deleteDetail(id: number) {
    return this.http.delete(`${this.apiUrl}/testdetail/${id}`,)
  }

  update(test: Test) {
    return this.http.put(`${this.apiUrl}/tests/${test.id}`,test)
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Analysis, iAnalysis } from 'src/app/models/Analysis.model';
import { iTest, Test } from 'src/app/models/Test.model';
import { Page, Pagination } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {




  private apiUrl = 'http://localhost:5000/api';
  listExamenes$ = new BehaviorSubject<iTest[] >([]);
  listSeletedTest$ = new BehaviorSubject<iTest[] >([]);
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  listAnalysis$ = new BehaviorSubject<iAnalysis[] >([]);
  paginationAnalisys$ = new BehaviorSubject<Pagination | null>(null);
 private listExamenesSubscription!: Subscription;

 private page: Page ={ page: 1, size: 10}
  constructor(
    private http: HttpClient
  ) {

  }

  getallTest(){
    this
      .getAllTest({ page: 1, size: 10 })
      .pipe(
        tap((res: any) => {
          this.listExamenes$.next(res.data)
          this.pagination$.next(res.meta)
        })
      )
      .subscribe();
  }

  getallAnalysis(){
    this
      .getAllAnalysis({ page: 1, size: 10 })
      .pipe(
        tap((res: any) => {
          this.listAnalysis$.next(res.data)
          this.paginationAnalisys$.next(res.meta)
        })
      )
      .subscribe();
  }
 getAllTest(page: Page) {
    return this.http.get<iTest[]>(`${this.apiUrl}/tests?page=${page.page}&size=${page.size}`);
  }
  getAllAnalysis(page: Page) {
    return this.http.get<iAnalysis[]>(`${this.apiUrl}/analisys?page=${page.page}&size=${page.size}`);
  }


  saveTest(test: Test) {
    return this.http.post<iTest>(`${this.apiUrl}/tests`, test)
  }
  saveAnalysis(analysis: Analysis) {
    return this.http.post<Analysis>(`${this.apiUrl}/analisys`, analysis)
  }
  deleteTest(test: Test) {
    return this.http.delete(`${this.apiUrl}/tests/${test.id}`,)
  }

  deleteAnalysis(analysis: Analysis) {
    return this.http.delete(`${this.apiUrl}/analisys/${analysis.id}`,)
  }

  deleteAnalysisTest(id: number) {
    return this.http.delete(`${this.apiUrl}/analysisTest/${id}`,)
  }



  deleteDetail(id: number) {
    return this.http.delete(`${this.apiUrl}/testdetail/${id}`,)
  }

  update(test: Test) {
    return this.http.put(`${this.apiUrl}/tests/${test.id}`,test)
  }

  searchTest(query: any) {
    let params = new HttpParams().set('search', query);
    return this.http.get<iTest[]>(`${this.apiUrl}/tests/search`, {params})
  }

  createBulkTests(tests: Test[]) {
    return this.http.post<Test[]>(`${this.apiUrl}/tests/bulk`, {tests})
  }

}

import { Component, OnInit } from '@angular/core';
import { cryptoMarketData } from 'src/app/shared/data/crypto-market';
import * as chartData from '../../../shared/data/crypto-market';
import { AnalysisService } from '../analysis.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { iTest } from 'src/app/models/Test.model';
import { Page, Pagination } from 'src/app/models/utils';

@Component({
  selector: 'app-marketcap',
  templateUrl: './marketcap.component.html',
  styleUrls: ['./marketcap.component.scss'],
})
export class MarketcapComponent implements OnInit {
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  paginat: Pagination | null = null

  public cryptoMarketData = cryptoMarketData;

  constructor(public serviceAnalysis: AnalysisService) {}

  ngOnInit(): void {
    this.serviceAnalysis
      .getAllExamenes({ page: 1, size: 10 })
      .pipe(
        tap((res: any) => {
          this.serviceAnalysis.listExamenes$.next(res.data)
          this.paginat = res.meta
          this.pagination$.next(this.paginat)
        })
      )
      .subscribe();
  }
  getTotalPaginas(totalItems, pageSize) {
    return Math.ceil(totalItems / pageSize);
  }

  get paginas(){
    return this.generateNumberRange(this.getTotalPaginas(this.pagination$.value.total, this.pagination$.value.size))
  }

  generateNumberRange(end: number): number[] {
    const numbers: number[] = [];

    for (let i = 1; i <= end; i += 1) {
      numbers.push(i);
    }

    return numbers;
  }

}

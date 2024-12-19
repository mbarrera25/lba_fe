import { Component, OnInit } from '@angular/core';
import { ExchangeCurrencyService } from '../exchange-currency.service';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss']
})
export class ExchangeRateComponent implements OnInit {

  constructor(
    public exchangeCurrencyService: ExchangeCurrencyService

  ) { }

  ngOnInit(): void {
    this.exchangeCurrencyService.getTasas();
  }

    getTasaDolar() {
    return this.exchangeCurrencyService.updateTasa();
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MarketcapComponent } from './marketcap/marketcap.component';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange.component';
import { BuySellComponent } from './buy-sell/buy-sell.component';
import { WalletComponent } from './wallet/wallet.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CryptoRoutingModule } from './crypto-routing.module';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CryptoDashboardComponent } from './crypto-dashboard/crypto-dashboard.component';
import { TestFormComponent } from './marketcap/test-form/test-form.component';
import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
  declarations: [MarketcapComponent, CurrencyExchangeComponent, BuySellComponent, WalletComponent, TransactionsComponent, CryptoDashboardComponent, TestFormComponent],
  imports: [
    CommonModule,
    CryptoRoutingModule,
    ChartsModule,
    NgApexchartsModule,
    NgSelectModule,
    NgbModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule,
    ToastrModule.forRoot(
      {
        timeOut: 1000
      }
    ),
    ArchwizardModule,

  ],
  providers: [
    ToastrService, NgbModalConfig
  ]
})
export class CryptoModule { }

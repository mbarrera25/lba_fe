import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExchangeCurrencyService } from './exchange-currency.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
})
export class ConfiguracionComponent implements OnInit {
  currentTab: string = 'update-rate';
  active = 1;
  constructor(
    private modalService: NgbModal,
    public exchangeCurrencyService: ExchangeCurrencyService
  ) {}

  ngOnInit(): void {

  }

  open(content) {
    this.modalService.open(content, {
      backdrop: 'static',
      windowClass: 'modalCusSty',
    });
  }

}

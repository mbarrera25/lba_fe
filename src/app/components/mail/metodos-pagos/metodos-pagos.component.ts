import { Component, OnInit } from '@angular/core';
import { ExchangeCurrencyService } from '../exchange-currency.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from 'src/app/models/ExchangeCurrancy.model';
import { paymentTypes } from 'src/app/models/metodosPagos.model';

@Component({
  selector: 'app-metodos-pagos',
  templateUrl: './metodos-pagos.component.html',
  styleUrls: ['./metodos-pagos.component.scss']
})
export class MetodosPagosComponent implements OnInit {
  metodoPagoForm: FormGroup;

  
  listTypes = paymentTypes.map(value => ({ value }));

  constructor(
    public exchangeCurrencyService: ExchangeCurrencyService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.loadCurrencies()
    this.loadMetodosDePago()
  }

  initForm(){
    this.metodoPagoForm = this.fb.group({
      id: [],
      code: ['',Validators.required],
      name: ['',Validators.required],
      currency_id: [,Validators.required],
      symbol: ['',Validators.required],
      type: ['',Validators.required]
    });
  }

  onSubmitMetodoPago() {
    if (this.metodoPagoForm.valid) {
      console.log(this.metodoPagoForm.value);
      if (this.metodoPagoForm.value.id){
        this.exchangeCurrencyService.updateMetodoDePago(this.metodoPagoForm.value.id,this.metodoPagoForm.value).subscribe(() => {
          this.loadMetodosDePago();
          this.metodoPagoForm.reset();
        });

      }else{
        this.exchangeCurrencyService.createMetodoDePago(this.metodoPagoForm.value).subscribe(() => {
         this.loadMetodosDePago();
         this.metodoPagoForm.reset();
       });
      }

    }
  }

  editMetodoPago(metodo: any) {
    this.metodoPagoForm.patchValue(metodo);
  }

  deleteMetodoPago(id: number) {
    this.exchangeCurrencyService.deleteMetodoDePago(id).subscribe(() => {
      this.loadMetodosDePago();
    });
  }

  loadCurrencies(): void {
    this.exchangeCurrencyService.getCurrencies().subscribe(data => {
      console.log(data);

      this.exchangeCurrencyService.currencies$.next(data)
    });
  }

  loadMetodosDePago(): void {
    this.exchangeCurrencyService.getMetodosDePago().subscribe(data => {
      this.exchangeCurrencyService.listMetodoPago$.next(data)
    });
  }

}

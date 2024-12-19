import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Book_Payment } from 'src/app/models/Talonario';
import { ExchangeCurrencyService } from '../exchange-currency.service';

@Component({
  selector: 'app-talonarios',
  templateUrl: './talonarios.component.html',
  styleUrls: ['./talonarios.component.scss']
})
export class TalonariosComponent implements OnInit {
  talonarioForm: FormGroup;

  constructor(
    public exchangeCurrencyService: ExchangeCurrencyService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.initForm()
    this.exchangeCurrencyService.getTalonarios();

  }

  initForm(){
    this.talonarioForm = this.fb.group({
      name: ['', Validators.required],
      nro_current: [1, Validators.required],
      nro_initial: [1, Validators.required],
      nro_end: [1000, Validators.required],
      serie: ['', Validators.required],
      type: ['', Validators.required],
      id: [],
      status: [true],
    });
  }

  onSubmit(): void {
    console.log(this.talonarioForm.value);

    if (this.talonarioForm.valid) {
      if (this.talonarioForm.value.id != null) {
        this.exchangeCurrencyService
          .editTalonario(this.talonarioForm.value)
          .subscribe(() => this.exchangeCurrencyService.getTalonarios());
      } else {
        this.exchangeCurrencyService
          .saveTalonario(this.talonarioForm.value)
          .subscribe(() => this.exchangeCurrencyService.getTalonarios());
      }
    }
  }

  cleanForm(){
    this.talonarioForm.patchValue({
      name: '',
      nro_current: '1',
      nro_initial: '1',
      nro_end: '1000',
      serie: '',
      type: '',
      id: '',
      status: '',
    });
  }

  editTalonario(talonario: Book_Payment) {
    this.talonarioForm.patchValue(talonario)
  }

  deleteTalonario(id: number) {
    this.exchangeCurrencyService.deleteTalonario(id).subscribe(() => this.exchangeCurrencyService.getTalonarios());
  }

}

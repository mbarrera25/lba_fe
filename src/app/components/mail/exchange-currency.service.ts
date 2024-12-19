import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Currency, ExchangeCurrancy, iCurrency } from 'src/app/models/ExchangeCurrancy.model';
import { iMetodoDePago } from 'src/app/models/metodosPagos.model';
import { iBook_Payment, Book_Payment } from 'src/app/models/Talonario';

@Injectable({
  providedIn: 'root',
})
export class ExchangeCurrencyService {

  urlExchangeRate = 'https://api.yourservice.com/exchange-rate';
  listtasas$ = new BehaviorSubject<ExchangeCurrancy[]>([]);
  listTalonarios$ = new BehaviorSubject<Book_Payment[]>([]);
  listMetodoPago$ = new BehaviorSubject<iMetodoDePago[]>([]);
  currencies$ = new BehaviorSubject<iCurrency[]>([]);
  apikey = 'aa44279955ea67f215974911';
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getTasaDolar() {
    const headers = new HttpHeaders({
      apikey: 'aa44279955ea67f215974911',
    });

    this.http
      .get(this.urlExchangeRate, { headers })
      .subscribe((response: any) => {
        const tasa = response.conversion_rates.VES;
        this.guardarTasa(tasa);
      });
  }
  guardarTasa(tasa: number) {
    const newTasa = new ExchangeCurrancy('USD', tasa);
    this.http.post(`${this.apiUrl}/tasa_moneda`, newTasa).subscribe(() => {
      this.getTasas();
    });
  }
  getTasas() {
    this.http
      .get<ExchangeCurrancy[]>(`${this.apiUrl}/exchangeCurrency`)
      .subscribe((data) => {
        this.listtasas$.next(data);
      });
  }

  getTasaToday(){
    return this.http
      .get<any>(`${this.apiUrl}/exchangeCurrency/today`)
  }
  updateTasa() {
    this.http
      .post(`${this.apiUrl}/exchange-rate`,'')
      .subscribe((data) => {
        this.getTasas()
      });
  }


  saveTalonario(value: any) {
    return this.http.post<Book_Payment[]>(`${this.apiUrl}/talonarios`, value);
  }
  editTalonario(value: iBook_Payment) {
    return this.http.put<iBook_Payment>(`${this.apiUrl}/talonarios/${value.id}`, value);
  }
  deleteTalonario(id: number) {
    return this.http.delete<iBook_Payment>(`${this.apiUrl}/talonarios/${id}`);
  }

  getTalonarios() {
    this.http
      .get<Book_Payment[]>(`${this.apiUrl}/talonarios`)
      .subscribe((data) => {
        this.listTalonarios$.next(data);
      });
  }


  getMetodosDePago(): Observable<any[]> {
    return this.http.get<iMetodoDePago[]>(`${this.apiUrl}/metodos-de-pago`);
  }

  createMetodoDePago(metodo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/metodos-de-pago`, metodo);
  }

  updateMetodoDePago(id: number, metodo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/metodos-de-pago/${id}`, metodo);
  }

  deleteMetodoDePago(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/metodos-de-pago/${id}`);
  }

  getCurrencies() {
    return this.http.get<iCurrency[]>(`${this.apiUrl}/currency`)
  }
}

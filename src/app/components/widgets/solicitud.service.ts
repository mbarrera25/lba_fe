import { ResultPatient } from './../../models/ResultPatient.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iAnalysis } from 'src/app/models/Analysis.model';
import { iPaciente } from 'src/app/models/paciente.model';
import { iRequest, Request, RequestReq } from 'src/app/models/solicitudes.model';
import { iBook_Payment } from 'src/app/models/Talonario';
import { ExchangeCurrencyService } from '../mail/exchange-currency.service';
import { iExchangeCurrancy } from 'src/app/models/ExchangeCurrancy.model';
import { Summary } from 'src/app/models/Summary.model';
import { Invoice } from 'src/app/models/Invoice.model';
import { Transaction } from 'src/app/models/Transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
 
  recordTransaction(f: Invoice) {
    const transaction = new Transaction(f);
    return this.http.post<Transaction>(`${this.apiUrl}/transaction`, transaction).subscribe();
  }


solicitudes$ = new BehaviorSubject<iRequest[]>([])
patients$ = new BehaviorSubject<iPaciente[]>([])
listAnalisis$ = new BehaviorSubject<iAnalysis[]>([])
listSeleccionableAnalisis$ = new BehaviorSubject<any[]>([])
paymentsBookActives$ = new BehaviorSubject<iBook_Payment[]>([])
invoiceNumber$ = new BehaviorSubject<string | null>(null)
paymentsMethods$ = new BehaviorSubject<iBook_Payment[]>([])
rate$ = new BehaviorSubject<iExchangeCurrancy | null>(null)
summary$ = new BehaviorSubject<Summary | null>(null)
private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient,
    private configurationService: ExchangeCurrencyService
  ) { }


  searchAnalysis(term: string): any {
    const params = new HttpParams().set('query', term);
    return this.http.get<string[]>(`${this.apiUrl}/analisys/search`, { params });
  }

  saveSolicitud(solicitud: RequestReq): Observable<any> {
    return this.http.post<RequestReq>(`${this.apiUrl}/solicitudes`, solicitud);
  }
  getAll(): Observable<any[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/solicitudes`);
  }
  getAllSolicitudes(){
    this.getAll().subscribe((resp) => this.solicitudes$.next(resp))
  }

  getBookPayments(type: string){
    return this.http.get<iBook_Payment[]>(`${this.apiUrl}/talonarios/filtered?type=${type}`)
  }

  incrementBookPayment(id: number){
    return this.http.put<iBook_Payment>(`${this.apiUrl}/talonarios/${id}/increment`,{}).subscribe()
  }
  getBookPaymenByType(type: string){
    this.getBookPayments(type).subscribe( (resp) => this.paymentsBookActives$.next(resp))
  }


  getAllPaymentMethod(){
    this.configurationService.getMetodosDePago().subscribe((resp) => this.paymentsMethods$.next(resp))
  }

  getRateNow(){

    this.configurationService.getTasaToday().subscribe( (resp) => {
      this.rate$.next(resp)

    })
  }

  createdInvoice(invoice: Invoice): Observable<any>{
    return this.http.post<Invoice>(`${this.apiUrl}/invoice`, invoice)
  }

  changeStatus(status: any, id: number) {
  return this.http.patch<any>(`${this.apiUrl}/solicitudes/${id}/status`, {status} ); // Realiza la solicitud PATCH
  }

  getAnalysisBySolicitud(id: number){
    return this.http.get<iAnalysis[]>(`${this.apiUrl}/loadResult/get-request/${id}`)
  }
  loadResults(resul: ResultPatient[]) {
    return this.http.post<ResultPatient[]>(`${this.apiUrl}/loadResult`, resul);
    
  }
}

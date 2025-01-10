import { Invoice } from "./Invoice.model";
import { PaymentType } from "./metodosPagos.model";

export class Transaction {
  patient: string;
  date: Date;
  type_transaction:PaymentType
  amount_bs:number
  amount_usd:number
  exchange_rate:number
  debit_amount_bs:number
  debit_amount_usd:number
  cash_amount_bs:number
  cash_amount_usd:number
  electronic_amount_bs:number
  electronic_amount_usd:number
  request_id:number

  constructor(
    invoice: Invoice
  ) {
    this.patient = invoice.name;
    this.date = invoice.date_at;
    this.type_transaction = invoice.pay_method;
    this.amount_bs = invoice.total_amount;
    this.amount_usd = Number((invoice.total_amount / invoice.rate).toFixed(2));
    this.exchange_rate = invoice.rate;
    this.debit_amount_bs = invoice.pay_method === PaymentTypeEnum.TarjetaDebitoBs ? invoice.total_amount : 0;
    this.debit_amount_usd = invoice.pay_method === PaymentTypeEnum.TarjetaDebitoUsd ? Number((invoice.total_amount / invoice.rate).toFixed(2)) : 0;
    this.cash_amount_bs = invoice.pay_method === PaymentTypeEnum.EfectivoBs ? invoice.total_amount : 0;
    this.cash_amount_usd =  invoice.pay_method === PaymentTypeEnum.EfectivoUsd ? Number((invoice.total_amount / invoice.rate).toFixed(2)) : 0;
    this.electronic_amount_bs =   invoice.pay_method === PaymentTypeEnum.ElectronicoBs
    || invoice.pay_method === PaymentTypeEnum.PagoTransferencia ? invoice.total_amount : 0;
    this.electronic_amount_usd =  invoice.pay_method === PaymentTypeEnum.ElectronicoUsd ? Number((invoice.total_amount / invoice.rate).toFixed(2)) : 0;
    this.request_id = invoice.request_id;
  }
}


export enum PaymentTypeEnum {
  EfectivoBs = 'Efectivo bs',
  EfectivoUsd = 'Efectivo usd',
  ElectronicoBs = 'Electronico bs',
  ElectronicoUsd = 'Electronico usd',
  TarjetaDebitoBs = 'Tarjeta de Debito Bs',
  TarjetaDebitoUsd = 'Tarjeta de Debito Usd',
  PagoTransferencia = 'pago m. / transferencia',
  TarjetaCredito = 'Tarjeta de Credito',
}

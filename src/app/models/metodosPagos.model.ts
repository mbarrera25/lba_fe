import { iCurrency } from "./ExchangeCurrancy.model";

export interface iMetodoDePago {
  id?: number;          // Opcional, porque en la creación aún no tiene un ID
  code: string;
  name: string;
  currency: iCurrency;
  symbol: string;
}


export type PaymentType = (typeof paymentTypes)[number];
export const paymentTypes = [
  'Efectivo bs',
  'Efectivo usd',
  'Electronico bs',
  'Electronico usd',
  'Tarjeta de Debito Bs',
  'Tarjeta de Debito Usd',
  'pago m. / transferencia',
  'Tarjeta de Credito'
];

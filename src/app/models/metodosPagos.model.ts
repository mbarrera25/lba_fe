import { iCurrency } from "./ExchangeCurrancy.model";

export interface iMetodoDePago {
  id?: number;          // Opcional, porque en la creación aún no tiene un ID
  code: string;
  namee: string;
  currency: iCurrency;
  symbol: string;
}

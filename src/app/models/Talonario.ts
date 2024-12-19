export class Book_Payment {
  name: string;
  nro_currency: number;
  nro_initial: number;
  nro_end: number;
  serie: string;
  type: string;
  status: boolean;

  constructor(
    name: string,
    nro_currency: number,
    nro_initial: number,
    nro_end: number,
    serie: string,
    type: string,
    status: boolean
  ) {
    this.name = name;
    this.nro_currency = nro_currency;
    this.nro_initial = nro_initial;
    this.nro_end = nro_end;
    this.serie = serie;
    this.type = type;
    this.status = status;
  }
}

export interface iBook_Payment extends Book_Payment{
  id: number
}

export type TYPE_PAYMENT =
  | 'efectivo_bs'
  | 'efectivo_usd'
  | 'debito'
  | 'electronico';

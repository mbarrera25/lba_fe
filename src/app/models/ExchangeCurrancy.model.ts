export class ExchangeCurrancy {
  fecha: Date = new Date()
  constructor(
    public currency: string,
    public rate: number,
  ){
    this.currency = currency,
    this.rate = rate
  }
}

export interface iExchangeCurrancy{
  currency: iCurrency,
  rate: number,
  date: Date
}

export class Currency{
  activa: boolean = true
  constructor(
    public name: string,
    public iso: string,
    public symbol: string,
  ){
    this.name = name
    this.iso = iso
    this.symbol = symbol
  }
}

export interface iCurrency{
  id?: number
  name: string
  iso: string
  symbol: string
}

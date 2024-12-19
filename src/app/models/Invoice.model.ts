import { iCurrency } from "./ExchangeCurrancy.model";


export class Invoice{
    date_at: Date = new Date()
    constructor(
        public name: string,
        public identification: string,
        public type_person: string,
        public direction: string,
        public invoice_number: string,
        public total_amount: number,
        public subtotal_amount: number,
        public igtf: number,
        public rate: number,
        public invoice_line: InvoiceDetail[],
        public currency: string
    ){
        this.name = name;
        this.identification = identification;
        this.type_person = type_person;
        this.direction = direction;
        this.invoice_number = invoice_number;
        this.total_amount = total_amount;
        this.subtotal_amount = subtotal_amount;
        this.igtf = igtf;
        this.rate = rate;
        this.invoice_line = invoice_line;
        this.currency = currency

    }
}


export interface iInvoice extends Invoice{
    id: number
}

export class InvoiceDetail{

    constructor(
        public quantity: number,
        public description: string, 
        public price: number,
        public total: number,
        public rate: number
    ){
        this.quantity = quantity;
        this.description = description;
        this.price = price * rate;
        this.total = total * rate;
        this.rate = rate;
    }
}
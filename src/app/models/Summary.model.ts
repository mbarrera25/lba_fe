export class Summary {
    constructor(
      private rate: number,
      private amount_igtf_usd: number,
      public subTotal_usd: number
    ) {
      this.subTotal_usd = subTotal_usd;
    }
    get igtf_bs(): number {
      return parseFloat((this.amount_igtf_usd * this.rate * rateIGTF).toFixed(2));
    }
    get igtf_usd(): number {
      return this.amount_igtf_usd;
    }

    get subtotal_bs() {
      return this.subTotal_usd * this.rate;
    }
  
    get total_Bs() {
      return this.igtf_bs + this.subtotal_bs;
    }
  
    get total_usd() {
      return this.total_Bs / this.rate;
    }
  
    get value(): iTotales {
      return {
        subTotal_usd: this.subTotal_usd,
        igtf_usd: this.igtf_usd,
        igtf_bs: this.igtf_bs,
        subtotal_bs: parseFloat(this.subtotal_bs.toFixed(2)),
        total_Bs: parseFloat(this.total_Bs.toFixed(2)),
        total_usd: parseFloat(this.total_usd.toFixed(2)),
      };
    }
  }

  export interface iTotales {
    subTotal_usd: number;
    igtf_bs: number;
    igtf_usd: number;
    subtotal_bs: number;
    total_Bs: number;
    total_usd: number;
  }


  const rateIGTF: number = 0.03;



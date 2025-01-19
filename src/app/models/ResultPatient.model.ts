export class ResultPatient  {
  date = new Date();
  constructor(
   // public observation,
    public valor,
    public request_id,
    public test_detail_id,
  ) {
    //this.observation= observation;
    this.valor = valor;
    this.request_id = request_id;
    this.test_detail_id = test_detail_id;
  }
}

export interface iResultPatient extends ResultPatient {}
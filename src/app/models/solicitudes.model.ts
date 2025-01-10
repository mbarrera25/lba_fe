import { iAnalysis } from "./Analysis.model";
import { Invoice } from "./Invoice.model";
import { iPaciente } from "./paciente.model";

export class RequestReq{
date: Date = new Date()
status: status = 'creado'
analysis: number[]
patient_id: number
sub_total: number = 0
  constructor(
    pacienteObj: iPaciente,
    analisisList: iAnalysis[],
    public observation: string
  ){
    this.patient_id = pacienteObj.id
    this.analysis = analisisList.map( an => an.id)
    this.observation = observation
    this.sub_total = analisisList.reduce((a, b) => a + b.price, 0);
    }

}

export interface iRequestReq extends RequestReq{}

export type status = 'creado' | 'en proceso' | 'completado' | 'entregado' | 'cancelado' | 'facturado'

export class Request{
  date: Date = new Date()
  status: status = 'creado'
  sub_total: number = 0
    constructor(
      public patient: iPaciente,
      public analysis: iAnalysis[],
      public observation: string
    ){
      this.patient = patient
      this.analysis = analysis
      this.observation = observation
      this.sub_total = this.analysis.reduce((a, b) => a + b.price, 0);
    }
  }

  export interface iRequest extends Request{
    id: number,
    invoice: Invoice
  }

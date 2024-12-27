import { Analysis } from "./Analysis.model";

export class Paciente {
  constructor(
    public id: number | null,
    public full_name: string,
    public date_birth: string,
    public gender: Genero,
    public identification: string,
    public email: string,
    public phone?: string,
    public address?: string,
    public blood_type?: string,
    public medical_history?: string,
    public allergies?: string
  ) {
    this.id = id;
    this.identification = identification;
    this.full_name = full_name;
    this.gender = gender;
    this.date_birth = date_birth;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.blood_type = blood_type;
    this.medical_history = medical_history;
    this.allergies = allergies;
  }
}
export interface iPaciente extends Paciente {}

export class PacienteRecord {
  constructor(
    public id: number,
    public patient: iPaciente,
    public analysis: iRecordAnalisys[]
  ) {
    this.patient = patient;
  }
}

export interface iRecordAnalisys{
  date: Date,
  status: string,
  analysis: Analysis[]
}

export type Genero = 'Masculino' | 'Femenino';

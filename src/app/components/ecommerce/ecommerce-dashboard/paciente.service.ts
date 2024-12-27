import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { number } from 'echarts';
import { BehaviorSubject, Observable } from 'rxjs';
import { iPaciente, PacienteRecord } from 'src/app/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  listPaciente$ = new BehaviorSubject<iPaciente[] >([]);
  pacientListRecord$ = new BehaviorSubject<iPaciente[] >([]);
  paciente = new BehaviorSubject<iPaciente | null>(null);
  pacientRecord$ = new BehaviorSubject<PacienteRecord | null>(null);
  private apiUrl = 'http://localhost:5000/api';


  constructor(private http: HttpClient) {}

  getAllPatients(){
    this.getAll().subscribe((resp) => this.listPaciente$.next(resp))
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  create(paciente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patients`, paciente);
  }

  update(paciente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patients`, paciente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patients/${id}`);
  }
    searchPatient(term: string): any {
      const params = new HttpParams().set('query', term);
      return this.http.get<string[]>(`${this.apiUrl}/patients/search`, { params });
    }
     getPatientRecord(id: number): Observable<PacienteRecord> {
        return this.http.get<any>(`${this.apiUrl}/solicitudes/patient/${id}`);
      }
}

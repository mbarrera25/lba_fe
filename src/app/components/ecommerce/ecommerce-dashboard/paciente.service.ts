import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iPaciente } from 'src/app/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  listPaciente$ = new BehaviorSubject<iPaciente[] >([]);
  paciente = new BehaviorSubject<iPaciente | null>(null);
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
}

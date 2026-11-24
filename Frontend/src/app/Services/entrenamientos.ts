import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha?: string;
  duracion_minutos?: number;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EntrenamientosService {
  private readonly url = 'http://localhost:3000/api/v1/entrenamientos';

  constructor(private http: HttpClient) {}

  getEntrenamientos(): Observable<Entrenamiento[]> {
    return this.http.get<Entrenamiento[]>(this.url);
  }

  getEntrenamientoById(id: number): Observable<Entrenamiento> {
    return this.http.get<Entrenamiento>(`${this.url}/${id}`);
  }

  crearEntrenamiento(entrenamiento: Omit<Entrenamiento, 'id' | 'fecha_creacion'>): Observable<Entrenamiento> {
    return this.http.post<Entrenamiento>(this.url, entrenamiento);
  }

  actualizarEntrenamiento(
    id: number,
    entrenamiento: Omit<Entrenamiento, 'id' | 'fecha_creacion'>,
  ): Observable<Entrenamiento> {
    return this.http.put<Entrenamiento>(`${this.url}/${id}`, entrenamiento);
  }

  actualizarParcialEntrenamiento(
    id: number,
    entrenamiento: Partial<Omit<Entrenamiento, 'id' | 'fecha_creacion'>>,
  ): Observable<Entrenamiento> {
    return this.http.patch<Entrenamiento>(`${this.url}/${id}`, entrenamiento);
  }

  eliminarEntrenamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
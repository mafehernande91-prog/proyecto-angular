import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntrenamientosService {

 private readonly url = 'http://localhost:3000/api/v1/entrenamientos';

  constructor(private http: HttpClient) {}

  // Obtener todos los entrenamientos
  public getEntrenamientos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // Obtener un entrenamiento por ID
  getEntrenamientoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  // Crear un entrenamiento
  crearEntrenamiento(entrenamiento: any): Observable<any> {
    return this.http.post<any>(this.url, entrenamiento);
  }

  // Actualizar completamente un entrenamiento
  actualizarEntrenamiento(id: number, entrenamiento: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, entrenamiento);
  }

  // Actualizar parcialmente un entrenamiento
  actualizarParcialEntrenamiento(id: number, entrenamiento: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, entrenamiento);
  }

  // Eliminar un entrenamiento
  eliminarEntrenamiento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
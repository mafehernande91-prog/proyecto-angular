import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { EntrenamientosService } from '../../Services/entrenamientos';

@Component({
  imports: [MatTableModule],
  selector: 'app-entrenamiento',
  styleUrl: './entrenamiento.css',
  templateUrl: './entrenamiento.html',
})
export class Entrenamiento {

entrenamientos = signal<any[]>([]);

displayedColumns = ['id', 'nombre', 'descripcion', 'fecha', 'duracion_minutos'];

constructor(public entrenamientosService: EntrenamientosService) {
this.entrenamientosService.getEntrenamientos().subscribe({
next: (data:any[]) => {
console.log(data);
this.entrenamientos.set(data);
},
error: (err) => console.error(err)
})
}

}
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface Exercise {
  id: number;
  name: string;
  focus: string;
  duration: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [MatTableModule],
})
export class TableComponent {
  readonly exercises: Exercise[] = [
    { id: 1, name: 'Saque por zonas', focus: 'Saque y precisión', duration: 15 },
    { id: 2, name: 'Recepción en parejas', focus: 'Recepción y control', duration: 20 },
    { id: 3, name: 'Remate con colocación', focus: 'Ataque y coordinación', duration: 20 },
    { id: 4, name: 'Bloqueo y cobertura', focus: 'Defensa en la red', duration: 15 },
  ];

  readonly displayedColumns = ['id', 'name', 'focus', 'duration'];
}

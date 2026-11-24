import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  EntrenamientosService,
  type Entrenamiento as EntrenamientoDto,
} from '../../Services/entrenamientos';

@Component({
  imports: [MatTableModule],
  selector: 'app-entrenamiento',
  styleUrl: './entrenamiento.css',
  templateUrl: './entrenamiento.html',
})
export class Entrenamiento implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly entrenamientosService = inject(EntrenamientosService);

  readonly entrenamientos = signal<EntrenamientoDto[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly displayedColumns = ['id', 'nombre', 'descripcion', 'fecha', 'duracion_minutos'];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isLoading.set(true);
    this.entrenamientosService.getEntrenamientos().subscribe({
      next: (data) => {
        this.entrenamientos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los entrenamientos. Comprueba que el backend esté activo.');
        this.isLoading.set(false);
      },
    });
  }
}
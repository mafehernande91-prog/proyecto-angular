import { Component } from '@angular/core';

interface VolleyballEvent {
  name: string;
  date: string;
  details: string;
}

@Component({
  selector: 'app-eventos',
  styleUrl: './eventos.css',
  templateUrl: './eventos.html',
})
export class Eventos {
  readonly events: VolleyballEvent[] = [
    { name: 'Encuentro amistoso', date: 'Sábado · 9:00 a. m.', details: 'Partidos cortos para todos los niveles.' },
    { name: 'Torneo interno', date: 'Próximamente', details: 'Forma tu equipo y participa en la jornada del club.' },
  ];
}

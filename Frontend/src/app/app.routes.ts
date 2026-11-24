import { Routes } from '@angular/router';
import { Eventos } from './Views/eventos/eventos';
import { Ropa } from './Views/ropa/ropa';
import { Ejercicios } from './Components/ejercicios/ejercicios';
import { Entrenamiento } from './Views/entrenamiento/entrenamiento';

export const routes: Routes = [
  { path: '', component: Ejercicios },
  { path: 'ejercicios', component: Ejercicios },
  { path: 'eventos', component: Eventos },
  { path: 'ropa', component: Ropa },
  { path: 'entrenamiento', component: Entrenamiento },

];
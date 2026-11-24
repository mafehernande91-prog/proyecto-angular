import { Routes } from '@angular/router';
import { Eventos } from './Views/eventos/eventos';
import { Ropa } from './Views/ropa/ropa';
import { Ejercicios } from './Components/ejercicios/ejercicios';
import { Entrenamiento } from './Views/entrenamiento/entrenamiento';
import { LoginComponent } from './Views/login/login';
import { MenuComponent } from './Components/menu/menu.component';
import { authGuard } from './Services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MenuComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'ejercicios' },
      { path: 'ejercicios', component: Ejercicios },
      { path: 'eventos', component: Eventos },
      { path: 'ropa', component: Ropa },
      { path: 'entrenamiento', component: Entrenamiento },
    ],
  },
  { path: '**', redirectTo: '' },
];
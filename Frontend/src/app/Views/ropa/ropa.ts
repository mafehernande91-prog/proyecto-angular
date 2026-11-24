import { Component } from '@angular/core';

interface Product {
  name: string;
  description: string;
  price: string;
}

@Component({
  selector: 'app-ropa',
  styleUrl: './ropa.css',
  templateUrl: './ropa.html',
})
export class Ropa {
  readonly products: Product[] = [
    { name: 'Camiseta deportiva', description: 'Tela ligera para entrenar con comodidad.', price: 'Consultar' },
    { name: 'Rodilleras', description: 'Soporte y protección para jugar en cancha.', price: 'Consultar' },
    { name: 'Balón de voleibol', description: 'Balón de entrenamiento para interior.', price: 'Consultar' },
  ];
}

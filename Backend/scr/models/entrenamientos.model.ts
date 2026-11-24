import {
  entrenamientosDB,
  obtenerSiguienteId
} from '../config/entrenamientos.config';

export interface Entrenamiento {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha?: string;
  duracion_minutos?: number;
  fecha_creacion?: Date;
}

export class EntrenamientoModel {

  static async obtenerTodos(): Promise<Entrenamiento[]> {

    return entrenamientosDB;
  }

  static async obtenerPorId(
    id: number
  ): Promise<Entrenamiento | null> {

    return entrenamientosDB.find((entrenamiento: Entrenamiento) => entrenamiento.id === id) || null;
  }

  static async crear(
    entrenamiento: Entrenamiento
  ): Promise<Entrenamiento> {

    const nuevoEntrenamiento: Entrenamiento = {
      ...entrenamiento,
      id: obtenerSiguienteId(),
      fecha_creacion: new Date()
    };

    entrenamientosDB.push(nuevoEntrenamiento);

    return nuevoEntrenamiento;
  }

  static async actualizar(
    id: number,
    entrenamiento: Entrenamiento
  ): Promise<Entrenamiento | null> {

    const index = entrenamientosDB.findIndex((entrenamientoActual: Entrenamiento) => {
      return entrenamientoActual.id === id;
    });

    if (index === -1) {
      return null;
    }

    const entrenamientoActualizado: Entrenamiento = {
      ...entrenamientosDB[index],
      ...entrenamiento,
      id
    };

    entrenamientosDB[index] = entrenamientoActualizado;

    return entrenamientoActualizado;
  }

  static async eliminar(
    id: number
  ): Promise<boolean> {

    const index = entrenamientosDB.findIndex((entrenamiento: Entrenamiento) => entrenamiento.id === id);

    if (index === -1) {
      return false;
    }

    entrenamientosDB.splice(index, 1);

    return true;
  }
}

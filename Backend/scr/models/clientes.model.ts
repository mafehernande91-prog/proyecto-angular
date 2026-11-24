import {
  clientesDB,
  obtenerSiguienteId
} from '../config/clientes.config';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  edad?: number;
  sexo?: string;
  email: string;
  fecha_creacion: Date;
}

export type NuevoCliente = Pick<Cliente, 'nombre' | 'apellido' | 'email'> &
  Partial<Pick<Cliente, 'edad' | 'sexo'>>;
export type ActualizacionCliente = Partial<NuevoCliente>;

export class ClienteModel {
  static async obtenerTodos(): Promise<Cliente[]> {
    return clientesDB;
  }

  static async obtenerPorId(id: number): Promise<Cliente | null> {
    return clientesDB.find((cliente) => cliente.id === id) ?? null;
  }

  static async crear(cliente: NuevoCliente): Promise<Cliente> {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: obtenerSiguienteId(),
      fecha_creacion: new Date(),
    };

    clientesDB.push(nuevoCliente);
    return nuevoCliente;
  }

  static async actualizar(id: number, cliente: ActualizacionCliente): Promise<Cliente | null> {
    const index = clientesDB.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const clienteActualizado: Cliente = {
      ...clientesDB[index],
      ...cliente,
      id,
    };

    clientesDB[index] = clienteActualizado;
    return clienteActualizado;
  }

  static async eliminar(id: number): Promise<boolean> {
    const index = clientesDB.findIndex((cliente) => cliente.id === id);
    if (index === -1) {
      return false;
    }

    clientesDB.splice(index, 1);
    return true;
  }
}

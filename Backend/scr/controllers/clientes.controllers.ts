import { Request, Response } from 'express';

import { ClienteModel } from '../models/clientes.model';

const validarCliente = (datos: any, parcial: boolean): string | null => {

  const { nombre, apellido, edad, sexo, email } = datos ?? {};

  if (!parcial && (!nombre || !apellido || !email)) {
    return 'nombre, apellido y email son obligatorios';
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim())) {
    return 'nombre no es valido';
  }

  if (apellido !== undefined && (typeof apellido !== 'string' || !apellido.trim())) {
    return 'apellido no es valido';
  }

  if (email !== undefined && (typeof email !== 'string' || !email.includes('@'))) {
    return 'email no es valido';
  }

  if (edad !== undefined && (typeof edad !== 'number' || edad <= 0)) {
    return 'edad debe ser un numero mayor a 0';
  }

  if (sexo !== undefined && typeof sexo !== 'string') {
    return 'sexo no es valido';
  }

  return null;
};

const seleccionarCampos = (datos: any) => {

  const { nombre, apellido, edad, sexo, email } = datos ?? {};

  return Object.fromEntries(
    Object.entries({ nombre, apellido, edad, sexo, email })
      .filter(([, valor]) => valor !== undefined)
  ) as any;
};
 
export const obtenerClientes = async (req: Request, res: Response) => {

  const clientes = await ClienteModel.obtenerTodos();
 
  res.json(clientes);

};
 
export const obtenerClientePorId = async (req: Request, res: Response) => {

  const id = Number(req.params.id);
 
  const cliente = await ClienteModel.obtenerPorId(id);
 
  if (!cliente) {

    return res.status(404).json({

      message: 'Cliente no encontrado'

    });

  }
 
  res.json(cliente);

};
 
export const crearCliente = async (req: Request, res: Response) => {

  const error = validarCliente(req.body, false);
 
  if (error) {

    return res.status(400).json({

      message: error

    });

  }
 
  const cliente = await ClienteModel.crear(seleccionarCampos(req.body));
 
  res.status(201).json(cliente);

};
 
export const actualizarCliente = async (req: Request, res: Response) => {

  const id = Number(req.params.id);
 
  const error = validarCliente(req.body, true);
 
  if (error) {

    return res.status(400).json({

      message: error

    });

  }
 
  const cliente = await ClienteModel.actualizar(id, seleccionarCampos(req.body));
 
  if (!cliente) {

    return res.status(404).json({

      message: 'Cliente no encontrado'

    });

  }
 
  res.json(cliente);

};
 
export const eliminarCliente = async (req: Request, res: Response) => {

  const id = Number(req.params.id);
 
  const eliminado = await ClienteModel.eliminar(id);
 
  if (!eliminado) {

    return res.status(404).json({

      message: 'Cliente no encontrado'

    });

  }
 
  res.status(204).send();

};

 
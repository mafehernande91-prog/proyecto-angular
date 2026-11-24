import { Request, Response } from 'express';

import { EntrenamientoModel } from '../models/entrenamientos.model';

const validarEntrenamiento = (datos: any, parcial: boolean): string | null => {

  const { nombre, descripcion, fecha, duracion_minutos } = datos ?? {};

  if (!parcial && !nombre) {
    return 'nombre es obligatorio';
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim())) {
    return 'nombre no es valido';
  }

  if (descripcion !== undefined && typeof descripcion !== 'string') {
    return 'descripcion no es valida';
  }

  if (fecha !== undefined && (typeof fecha !== 'string' || isNaN(Date.parse(fecha)))) {
    return 'fecha no es valida';
  }

  if (duracion_minutos !== undefined && (typeof duracion_minutos !== 'number' || duracion_minutos <= 0)) {
    return 'duracion_minutos debe ser un numero mayor a 0';
  }

  return null;
};

const seleccionarCampos = (datos: any) => {

  const { nombre, descripcion, fecha, duracion_minutos } = datos ?? {};

  return Object.fromEntries(
    Object.entries({ nombre, descripcion, fecha, duracion_minutos })
      .filter(([, valor]) => valor !== undefined)
  ) as any;
};

export const obtenerEntrenamientos = async (req: Request, res: Response) => {

  const entrenamientos = await EntrenamientoModel.obtenerTodos();

  res.json(entrenamientos);

};

export const obtenerEntrenamientoPorId = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const entrenamiento = await EntrenamientoModel.obtenerPorId(id);

  if (!entrenamiento) {

    return res.status(404).json({

      message: 'Entrenamiento no encontrado'

    });

  }

  res.json(entrenamiento);

};

export const crearEntrenamiento = async (req: Request, res: Response) => {

  const error = validarEntrenamiento(req.body, false);

  if (error) {

    return res.status(400).json({

      message: error

    });

  }

  const entrenamiento = await EntrenamientoModel.crear(seleccionarCampos(req.body));

  res.status(201).json(entrenamiento);

};

export const actualizarEntrenamiento = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const error = validarEntrenamiento(req.body, false);

  if (error) {

    return res.status(400).json({

      message: error

    });

  }

  const entrenamiento = await EntrenamientoModel.actualizar(id, seleccionarCampos(req.body));

  if (!entrenamiento) {

    return res.status(404).json({

      message: 'Entrenamiento no encontrado'

    });

  }

  res.json(entrenamiento);

};

export const actualizarParcialEntrenamiento = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const error = validarEntrenamiento(req.body, true);

  if (error) {

    return res.status(400).json({

      message: error

    });

  }

  const entrenamiento = await EntrenamientoModel.actualizar(id, seleccionarCampos(req.body));

  if (!entrenamiento) {

    return res.status(404).json({

      message: 'Entrenamiento no encontrado'

    });

  }

  res.json(entrenamiento);

};

export const eliminarEntrenamiento = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const eliminado = await EntrenamientoModel.eliminar(id);

  if (!eliminado) {

    return res.status(404).json({

      message: 'Entrenamiento no encontrado'

    });

  }

  res.status(204).send();

};

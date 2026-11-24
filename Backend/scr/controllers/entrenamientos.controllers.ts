import { Request, Response } from 'express';
import {
  ActualizacionEntrenamiento,
  EntrenamientoModel,
  NuevoEntrenamiento,
} from '../models/entrenamientos.model';
import { isRecord, parseId } from '../utils/http';

type EntrenamientoCampos = ActualizacionEntrenamiento;
type ResultadoValidacion =
  | { valido: true; datos: EntrenamientoCampos }
  | { valido: false; error: string };

function validarEntrenamiento(body: unknown, parcial: boolean): ResultadoValidacion {
  if (!isRecord(body)) {
    return { valido: false, error: 'El cuerpo de la solicitud debe ser un objeto.' };
  }

  const datos: EntrenamientoCampos = {};

  if (body['nombre'] !== undefined) {
    if (typeof body['nombre'] !== 'string' || !body['nombre'].trim()) {
      return { valido: false, error: 'nombre debe ser un texto no vacío.' };
    }
    datos.nombre = body['nombre'].trim();
  }

  if (!parcial && !datos.nombre) {
    return { valido: false, error: 'nombre es obligatorio.' };
  }

  if (body['descripcion'] !== undefined) {
    if (typeof body['descripcion'] !== 'string') {
      return { valido: false, error: 'descripcion debe ser un texto.' };
    }
    datos.descripcion = body['descripcion'].trim();
  }

  if (body['fecha'] !== undefined) {
    if (
      typeof body['fecha'] !== 'string' ||
      !body['fecha'].trim() ||
      Number.isNaN(Date.parse(body['fecha']))
    ) {
      return { valido: false, error: 'fecha debe ser una fecha válida.' };
    }
    datos.fecha = body['fecha'].trim();
  }

  if (body['duracion_minutos'] !== undefined) {
    const duracion = body['duracion_minutos'];
    if (typeof duracion !== 'number' || !Number.isFinite(duracion) || duracion <= 0) {
      return { valido: false, error: 'duracion_minutos debe ser un número mayor a 0.' };
    }
    datos.duracion_minutos = duracion;
  }

  if (parcial && Object.keys(datos).length === 0) {
    return { valido: false, error: 'Incluye al menos un campo para actualizar.' };
  }

  return { valido: true, datos };
}

export async function obtenerEntrenamientos(_req: Request, res: Response): Promise<void> {
  res.json(await EntrenamientoModel.obtenerTodos());
}

export async function obtenerEntrenamientoPorId(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  const entrenamiento = await EntrenamientoModel.obtenerPorId(id);
  if (!entrenamiento) {
    res.status(404).json({ message: 'Entrenamiento no encontrado.' });
    return;
  }

  res.json(entrenamiento);
}

export async function crearEntrenamiento(req: Request, res: Response): Promise<void> {
  const resultado = validarEntrenamiento(req.body, false);
  if (!resultado.valido) {
    res.status(400).json({ message: resultado.error });
    return;
  }

  const nombre = resultado.datos.nombre;
  if (!nombre) {
    res.status(400).json({ message: 'nombre es obligatorio.' });
    return;
  }

  const nuevoEntrenamiento: NuevoEntrenamiento = { ...resultado.datos, nombre };
  res.status(201).json(await EntrenamientoModel.crear(nuevoEntrenamiento));
}

export async function actualizarEntrenamiento(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  const resultado = validarEntrenamiento(req.body, false);
  if (!resultado.valido) {
    res.status(400).json({ message: resultado.error });
    return;
  }

  const entrenamiento = await EntrenamientoModel.actualizar(id, resultado.datos);
  if (!entrenamiento) {
    res.status(404).json({ message: 'Entrenamiento no encontrado.' });
    return;
  }

  res.json(entrenamiento);
}

export async function actualizarParcialEntrenamiento(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  const resultado = validarEntrenamiento(req.body, true);
  if (!resultado.valido) {
    res.status(400).json({ message: resultado.error });
    return;
  }

  const entrenamiento = await EntrenamientoModel.actualizar(id, resultado.datos);
  if (!entrenamiento) {
    res.status(404).json({ message: 'Entrenamiento no encontrado.' });
    return;
  }

  res.json(entrenamiento);
}

export async function eliminarEntrenamiento(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  if (!(await EntrenamientoModel.eliminar(id))) {
    res.status(404).json({ message: 'Entrenamiento no encontrado.' });
    return;
  }

  res.status(204).send();
}

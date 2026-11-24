import { Request, Response } from 'express';
import { ActualizacionCliente, ClienteModel, NuevoCliente } from '../models/clientes.model';
import { isRecord, parseId } from '../utils/http';

type ClienteCampos = ActualizacionCliente;
type ResultadoValidacion =
  | { valido: true; datos: ClienteCampos }
  | { valido: false; error: string };

function validarCliente(body: unknown, parcial: boolean): ResultadoValidacion {
  if (!isRecord(body)) {
    return { valido: false, error: 'El cuerpo de la solicitud debe ser un objeto.' };
  }

  const datos: ClienteCampos = {};

  if (body['nombre'] !== undefined) {
    if (typeof body['nombre'] !== 'string' || !body['nombre'].trim()) {
      return { valido: false, error: 'nombre debe ser un texto no vacío.' };
    }
    datos.nombre = body['nombre'].trim();
  }

  if (body['apellido'] !== undefined) {
    if (typeof body['apellido'] !== 'string' || !body['apellido'].trim()) {
      return { valido: false, error: 'apellido debe ser un texto no vacío.' };
    }
    datos.apellido = body['apellido'].trim();
  }

  if (body['email'] !== undefined) {
    if (
      typeof body['email'] !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body['email'].trim())
    ) {
      return { valido: false, error: 'email debe ser una dirección válida.' };
    }
    datos.email = body['email'].trim().toLowerCase();
  }

  if (!parcial && (!datos.nombre || !datos.apellido || !datos.email)) {
    return { valido: false, error: 'nombre, apellido y email son obligatorios.' };
  }

  if (body['edad'] !== undefined) {
    const edad = body['edad'];
    if (typeof edad !== 'number' || !Number.isInteger(edad) || edad <= 0) {
      return { valido: false, error: 'edad debe ser un entero mayor a 0.' };
    }
    datos.edad = edad;
  }

  if (body['sexo'] !== undefined) {
    if (typeof body['sexo'] !== 'string') {
      return { valido: false, error: 'sexo debe ser un texto.' };
    }
    datos.sexo = body['sexo'].trim();
  }

  if (parcial && Object.keys(datos).length === 0) {
    return { valido: false, error: 'Incluye al menos un campo para actualizar.' };
  }

  return { valido: true, datos };
}

export async function obtenerClientes(_req: Request, res: Response): Promise<void> {
  res.json(await ClienteModel.obtenerTodos());
}

export async function obtenerClientePorId(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  const cliente = await ClienteModel.obtenerPorId(id);
  if (!cliente) {
    res.status(404).json({ message: 'Cliente no encontrado.' });
    return;
  }

  res.json(cliente);
}

export async function crearCliente(req: Request, res: Response): Promise<void> {
  const resultado = validarCliente(req.body, false);
  if (!resultado.valido) {
    res.status(400).json({ message: resultado.error });
    return;
  }

  const { nombre, apellido, email } = resultado.datos;
  if (!nombre || !apellido || !email) {
    res.status(400).json({ message: 'nombre, apellido y email son obligatorios.' });
    return;
  }

  const nuevoCliente: NuevoCliente = { ...resultado.datos, nombre, apellido, email };
  res.status(201).json(await ClienteModel.crear(nuevoCliente));
}

export async function actualizarCliente(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  const resultado = validarCliente(req.body, true);
  if (!resultado.valido) {
    res.status(400).json({ message: resultado.error });
    return;
  }

  const cliente = await ClienteModel.actualizar(id, resultado.datos);
  if (!cliente) {
    res.status(404).json({ message: 'Cliente no encontrado.' });
    return;
  }

  res.json(cliente);
}

export async function eliminarCliente(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params['id']);
  if (id === null) {
    res.status(400).json({ message: 'El id debe ser un entero positivo.' });
    return;
  }

  if (!(await ClienteModel.eliminar(id))) {
    res.status(404).json({ message: 'Cliente no encontrado.' });
    return;
  }

  res.status(204).send();
}

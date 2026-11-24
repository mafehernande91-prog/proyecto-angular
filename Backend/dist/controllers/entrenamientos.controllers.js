"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerEntrenamientos = obtenerEntrenamientos;
exports.obtenerEntrenamientoPorId = obtenerEntrenamientoPorId;
exports.crearEntrenamiento = crearEntrenamiento;
exports.actualizarEntrenamiento = actualizarEntrenamiento;
exports.actualizarParcialEntrenamiento = actualizarParcialEntrenamiento;
exports.eliminarEntrenamiento = eliminarEntrenamiento;
const entrenamientos_model_1 = require("../models/entrenamientos.model");
const http_1 = require("../utils/http");
function validarEntrenamiento(body, parcial) {
    if (!(0, http_1.isRecord)(body)) {
        return { valido: false, error: 'El cuerpo de la solicitud debe ser un objeto.' };
    }
    const datos = {};
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
        if (typeof body['fecha'] !== 'string' ||
            !body['fecha'].trim() ||
            Number.isNaN(Date.parse(body['fecha']))) {
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
async function obtenerEntrenamientos(_req, res) {
    res.json(await entrenamientos_model_1.EntrenamientoModel.obtenerTodos());
}
async function obtenerEntrenamientoPorId(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    const entrenamiento = await entrenamientos_model_1.EntrenamientoModel.obtenerPorId(id);
    if (!entrenamiento) {
        res.status(404).json({ message: 'Entrenamiento no encontrado.' });
        return;
    }
    res.json(entrenamiento);
}
async function crearEntrenamiento(req, res) {
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
    const nuevoEntrenamiento = { ...resultado.datos, nombre };
    res.status(201).json(await entrenamientos_model_1.EntrenamientoModel.crear(nuevoEntrenamiento));
}
async function actualizarEntrenamiento(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    const resultado = validarEntrenamiento(req.body, false);
    if (!resultado.valido) {
        res.status(400).json({ message: resultado.error });
        return;
    }
    const entrenamiento = await entrenamientos_model_1.EntrenamientoModel.actualizar(id, resultado.datos);
    if (!entrenamiento) {
        res.status(404).json({ message: 'Entrenamiento no encontrado.' });
        return;
    }
    res.json(entrenamiento);
}
async function actualizarParcialEntrenamiento(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    const resultado = validarEntrenamiento(req.body, true);
    if (!resultado.valido) {
        res.status(400).json({ message: resultado.error });
        return;
    }
    const entrenamiento = await entrenamientos_model_1.EntrenamientoModel.actualizar(id, resultado.datos);
    if (!entrenamiento) {
        res.status(404).json({ message: 'Entrenamiento no encontrado.' });
        return;
    }
    res.json(entrenamiento);
}
async function eliminarEntrenamiento(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    if (!(await entrenamientos_model_1.EntrenamientoModel.eliminar(id))) {
        res.status(404).json({ message: 'Entrenamiento no encontrado.' });
        return;
    }
    res.status(204).send();
}
//# sourceMappingURL=entrenamientos.controllers.js.map
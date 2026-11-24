"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerClientes = obtenerClientes;
exports.obtenerClientePorId = obtenerClientePorId;
exports.crearCliente = crearCliente;
exports.actualizarCliente = actualizarCliente;
exports.eliminarCliente = eliminarCliente;
const clientes_model_1 = require("../models/clientes.model");
const http_1 = require("../utils/http");
function validarCliente(body, parcial) {
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
    if (body['apellido'] !== undefined) {
        if (typeof body['apellido'] !== 'string' || !body['apellido'].trim()) {
            return { valido: false, error: 'apellido debe ser un texto no vacío.' };
        }
        datos.apellido = body['apellido'].trim();
    }
    if (body['email'] !== undefined) {
        if (typeof body['email'] !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body['email'].trim())) {
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
async function obtenerClientes(_req, res) {
    res.json(await clientes_model_1.ClienteModel.obtenerTodos());
}
async function obtenerClientePorId(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    const cliente = await clientes_model_1.ClienteModel.obtenerPorId(id);
    if (!cliente) {
        res.status(404).json({ message: 'Cliente no encontrado.' });
        return;
    }
    res.json(cliente);
}
async function crearCliente(req, res) {
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
    const nuevoCliente = { ...resultado.datos, nombre, apellido, email };
    res.status(201).json(await clientes_model_1.ClienteModel.crear(nuevoCliente));
}
async function actualizarCliente(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    const resultado = validarCliente(req.body, true);
    if (!resultado.valido) {
        res.status(400).json({ message: resultado.error });
        return;
    }
    const cliente = await clientes_model_1.ClienteModel.actualizar(id, resultado.datos);
    if (!cliente) {
        res.status(404).json({ message: 'Cliente no encontrado.' });
        return;
    }
    res.json(cliente);
}
async function eliminarCliente(req, res) {
    const id = (0, http_1.parseId)(req.params['id']);
    if (id === null) {
        res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        return;
    }
    if (!(await clientes_model_1.ClienteModel.eliminar(id))) {
        res.status(404).json({ message: 'Cliente no encontrado.' });
        return;
    }
    res.status(204).send();
}
//# sourceMappingURL=clientes.controllers.js.map
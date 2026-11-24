"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarCliente = exports.actualizarCliente = exports.crearCliente = exports.obtenerClientePorId = exports.obtenerClientes = void 0;
const clientes_model_1 = require("../models/clientes.model");
const obtenerClientes = async (req, res) => {
    const clientes = await clientes_model_1.ClienteModel.obtenerTodos();
    res.json(clientes);
};
exports.obtenerClientes = obtenerClientes;
const obtenerClientePorId = async (req, res) => {
    const id = Number(req.params.id);
    const cliente = await clientes_model_1.ClienteModel.obtenerPorId(id);
    if (!cliente) {
        return res.status(404).json({
            message: 'Cliente no encontrado'
        });
    }
    res.json(cliente);
};
exports.obtenerClientePorId = obtenerClientePorId;
const crearCliente = async (req, res) => {
    const cliente = await clientes_model_1.ClienteModel.crear(req.body);
    res.status(201).json(cliente);
};
exports.crearCliente = crearCliente;
const actualizarCliente = async (req, res) => {
    const id = Number(req.params.id);
    const cliente = await clientes_model_1.ClienteModel.actualizar(id, req.body);
    if (!cliente) {
        return res.status(404).json({
            message: 'Cliente no encontrado'
        });
    }
    res.json(cliente);
};
exports.actualizarCliente = actualizarCliente;
const eliminarCliente = async (req, res) => {
    const id = Number(req.params.id);
    const eliminado = await clientes_model_1.ClienteModel.eliminar(id);
    if (!eliminado) {
        return res.status(404).json({
            message: 'Cliente no encontrado'
        });
    }
    res.status(204).send();
};
exports.eliminarCliente = eliminarCliente;
//# sourceMappingURL=clientes.controllers.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = void 0;
const clientes_config_1 = require("../config/clientes.config");
class ClienteModel {
    static async obtenerTodos() {
        return clientes_config_1.clientesDB;
    }
    static async obtenerPorId(id) {
        return clientes_config_1.clientesDB.find((cliente) => cliente.id === id) ?? null;
    }
    static async crear(cliente) {
        const nuevoCliente = {
            ...cliente,
            id: (0, clientes_config_1.obtenerSiguienteId)(),
            fecha_creacion: new Date(),
        };
        clientes_config_1.clientesDB.push(nuevoCliente);
        return nuevoCliente;
    }
    static async actualizar(id, cliente) {
        const index = clientes_config_1.clientesDB.findIndex((item) => item.id === id);
        if (index === -1) {
            return null;
        }
        const clienteActualizado = {
            ...clientes_config_1.clientesDB[index],
            ...cliente,
            id,
        };
        clientes_config_1.clientesDB[index] = clienteActualizado;
        return clienteActualizado;
    }
    static async eliminar(id) {
        const index = clientes_config_1.clientesDB.findIndex((cliente) => cliente.id === id);
        if (index === -1) {
            return false;
        }
        clientes_config_1.clientesDB.splice(index, 1);
        return true;
    }
}
exports.ClienteModel = ClienteModel;
//# sourceMappingURL=clientes.model.js.map
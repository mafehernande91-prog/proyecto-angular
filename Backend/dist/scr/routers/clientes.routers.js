"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controllers_1 = require("../controllers/clientes.controllers");
const router = (0, express_1.Router)();
router.get('/', clientes_controllers_1.obtenerClientes);
router.get('/:id', clientes_controllers_1.obtenerClientePorId);
router.post('/', clientes_controllers_1.crearCliente);
router.put('/:id', clientes_controllers_1.actualizarCliente);
router.delete('/:id', clientes_controllers_1.eliminarCliente);
exports.default = router;
//# sourceMappingURL=clientes.routers.js.map
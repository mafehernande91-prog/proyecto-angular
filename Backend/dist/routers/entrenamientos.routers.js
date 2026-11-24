"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entrenamientos_controllers_1 = require("../controllers/entrenamientos.controllers");
const router = (0, express_1.Router)();
router.get('/', entrenamientos_controllers_1.obtenerEntrenamientos);
router.get('/:id', entrenamientos_controllers_1.obtenerEntrenamientoPorId);
router.post('/', entrenamientos_controllers_1.crearEntrenamiento);
router.put('/:id', entrenamientos_controllers_1.actualizarEntrenamiento);
router.patch('/:id', entrenamientos_controllers_1.actualizarParcialEntrenamiento);
router.delete('/:id', entrenamientos_controllers_1.eliminarEntrenamiento);
exports.default = router;
//# sourceMappingURL=entrenamientos.routers.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrenamientoModel = void 0;
const entrenamientos_config_1 = require("../config/entrenamientos.config");
class EntrenamientoModel {
    static async obtenerTodos() {
        return entrenamientos_config_1.entrenamientosDB;
    }
    static async obtenerPorId(id) {
        return entrenamientos_config_1.entrenamientosDB.find((entrenamiento) => entrenamiento.id === id) ?? null;
    }
    static async crear(entrenamiento) {
        const nuevoEntrenamiento = {
            ...entrenamiento,
            id: (0, entrenamientos_config_1.obtenerSiguienteId)(),
            fecha_creacion: new Date(),
        };
        entrenamientos_config_1.entrenamientosDB.push(nuevoEntrenamiento);
        return nuevoEntrenamiento;
    }
    static async actualizar(id, entrenamiento) {
        const index = entrenamientos_config_1.entrenamientosDB.findIndex((item) => item.id === id);
        if (index === -1) {
            return null;
        }
        const entrenamientoActualizado = {
            ...entrenamientos_config_1.entrenamientosDB[index],
            ...entrenamiento,
            id,
        };
        entrenamientos_config_1.entrenamientosDB[index] = entrenamientoActualizado;
        return entrenamientoActualizado;
    }
    static async eliminar(id) {
        const index = entrenamientos_config_1.entrenamientosDB.findIndex((item) => item.id === id);
        if (index === -1) {
            return false;
        }
        entrenamientos_config_1.entrenamientosDB.splice(index, 1);
        return true;
    }
}
exports.EntrenamientoModel = EntrenamientoModel;
//# sourceMappingURL=entrenamientos.model.js.map
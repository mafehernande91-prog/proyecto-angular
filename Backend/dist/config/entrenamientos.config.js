"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerSiguienteId = exports.entrenamientosDB = void 0;
exports.entrenamientosDB = [
    {
        id: 1,
        nombre: 'Saque y recepcion',
        descripcion: 'Practica de saque por zonas y recepcion en parejas',
        fecha: '2026-10-21',
        duracion_minutos: 90,
        fecha_creacion: new Date('2026-10-05T18:00:00.000Z')
    },
    {
        id: 2,
        nombre: 'Remate y bloqueo',
        descripcion: 'Trabajo de ataque desde posicion 4 y bloqueo en red',
        fecha: '2026-10-23',
        duracion_minutos: 120,
        fecha_creacion: new Date('2026-10-05T18:05:00.000Z')
    }
];
let siguienteId = exports.entrenamientosDB.length + 1;
const obtenerSiguienteId = () => {
    const id = siguienteId;
    siguienteId += 1;
    return id;
};
exports.obtenerSiguienteId = obtenerSiguienteId;
//# sourceMappingURL=entrenamientos.config.js.map
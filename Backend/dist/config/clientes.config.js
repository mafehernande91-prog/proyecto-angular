"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerSiguienteId = exports.clientesDB = void 0;
exports.clientesDB = [
    {
        id: 1,
        nombre: 'Ana',
        apellido: 'Gomez',
        edad: 28,
        sexo: 'Femenino',
        email: 'ana.gomez@example.com',
        fecha_creacion: new Date('2026-10-05T18:00:00.000Z')
    },
    {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Rodriguez',
        edad: 34,
        sexo: 'Masculino',
        email: 'carlos.rodriguez@example.com',
        fecha_creacion: new Date('2026-10-05T18:05:00.000Z')
    }
];
let siguienteId = exports.clientesDB.length + 1;
const obtenerSiguienteId = () => {
    const id = siguienteId;
    siguienteId += 1;
    return id;
};
exports.obtenerSiguienteId = obtenerSiguienteId;
//# sourceMappingURL=clientes.config.js.map
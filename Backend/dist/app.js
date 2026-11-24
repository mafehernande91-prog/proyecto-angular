"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const clientes_routers_1 = __importDefault(require("./routers/clientes.routers"));
const entrenamientos_routers_1 = __importDefault(require("./routers/entrenamientos.routers"));
const http_1 = require("./utils/http");
const app = (0, express_1.default)();
function obtenerOrigenesPermitidos() {
    const developmentOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
    const configuredOrigins = (process.env.FRONT_URL ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    return [...developmentOrigins, ...configuredOrigins];
}
app.use((0, cors_1.default)({
    origin(origin, callback) {
        callback(null, !origin || obtenerOrigenesPermitidos().includes(origin));
    },
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use('/api/v1/clientes', clientes_routers_1.default);
app.use('/api/v1/entrenamientos', entrenamientos_routers_1.default);
const notFoundHandler = (_req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
};
const errorHandler = (error, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }
    const status = (0, http_1.isRecord)(error) && typeof error['status'] === 'number' ? error['status'] : 500;
    const safeStatus = status >= 400 && status < 600 ? status : 500;
    const message = safeStatus < 500 && error instanceof Error ? error.message : 'Error interno del servidor.';
    if (safeStatus >= 500) {
        console.error(error);
    }
    res.status(safeStatus).json({ message });
};
app.use(notFoundHandler);
app.use(errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map
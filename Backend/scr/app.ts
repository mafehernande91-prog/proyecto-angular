import cors from 'cors';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import clientesRoutes from './routers/clientes.routers';
import entrenamientosRoutes from './routers/entrenamientos.routers';
import { isRecord } from './utils/http';

const app = express();

function obtenerOrigenesPermitidos(): string[] {
  const developmentOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
  const configuredOrigins = (process.env.FRONT_URL ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...developmentOrigins, ...configuredOrigins];
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || obtenerOrigenesPermitidos().includes(origin));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/entrenamientos', entrenamientosRoutes);

const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
};

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status =
    isRecord(error) && typeof error['status'] === 'number' ? error['status'] : 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const message =
    safeStatus < 500 && error instanceof Error ? error.message : 'Error interno del servidor.';

  if (safeStatus >= 500) {
    console.error(error);
  }

  res.status(safeStatus).json({ message });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

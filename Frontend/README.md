# Vóley

Aplicación web sencilla para un equipo de voleibol. El frontend está hecho con Angular y el backend con Node.js, Express y TypeScript.

## Estructura

```text
proyecto angular/
├── Backend/                 API REST
│   └── scr/
│       ├── config/          Datos iniciales en memoria
│       ├── controllers/     Validación y lógica de las peticiones
│       ├── models/          Operaciones de clientes y entrenamientos
│       ├── routers/         Rutas de la API
│       ├── utils/           Utilidades HTTP
│       ├── app.ts           Configuración de Express, CORS y rutas
│       └── server.ts        Inicio del servidor
└── Frontend/                Aplicación Angular
    └── src/app/
        ├── Components/      Menú y ejercicios
        ├── Services/        Acceso a la API y sesión local
        ├── Views/           Login, ejercicios, eventos, ropa y entrenamientos
        └── app.routes.ts    Rutas de la aplicación
```

## Correr en local

Abre dos terminales desde la carpeta del proyecto:

```powershell
# Backend
cd Backend
npm install
npm run dev
```

```powershell
# Frontend
cd Frontend
npm install
npx ng serve
```

Abre `http://localhost:4200`. El backend queda disponible en `http://localhost:3000`.

Para probar la versión de producción localmente, ejecuta `npm run build` y después `npm start`.

## Funcionalidades

- Inicio de sesión y registro de demostración en el navegador.
- Consulta de ejercicios, eventos y artículos deportivos.
- Consulta y administración de entrenamientos mediante la API.
- API CRUD de clientes.

Los ejercicios, eventos, artículos y cuentas de acceso son datos locales de demostración. Clientes y entrenamientos se guardan en memoria en el backend; los cambios se pierden al reiniciar el servidor. El proyecto no está conectado actualmente a PostgreSQL ni tiene URLs de Railway configuradas.

## Scripts

| Carpeta | Script | Qué hace |
| --- | --- | --- |
| `Backend` | `npm run dev` | Inicia la API con recarga automática |
| `Backend` | `npm run build` | Compila TypeScript en `dist/` |
| `Backend` | `npm start` | Ejecuta la API compilada |
| `Backend` | `npm test` | Compila y ejecuta las pruebas disponibles |
| `Frontend` | `npx ng serve` | Inicia el servidor de desarrollo de Angular |
| `Frontend` | `npm run build` | Genera la compilación de producción |
| `Frontend` | `npm start` | Sirve la compilación SSR de producción |
| `Frontend` | `npm test -- --watch=false` | Ejecuta las pruebas de Angular |

## Despliegue del frontend en Railway

Configura el servicio con **Root Directory** `/Frontend`. Railpack puede detectar Angular desde allí; no se necesita un `railway.json` adicional. El comando de build es `npm run build` y el de inicio es `npm start`. El servidor SSR usa `PORT` de Railway y escucha en `0.0.0.0` (con puerto `4200` como valor local predeterminado). Para autorizar el dominio público del servicio SSR, configura `NG_ALLOWED_HOSTS` con el hostname exacto de Railway, sin protocolo ni puerto (por ejemplo, `mi-app.up.railway.app`).

La URL del backend todavía está fija en `src/app/Services/entrenamientos.ts` (`http://localhost:3000/api/v1/entrenamientos`). Debe cambiarse para producción. No hay configuración de entornos Angular en el proyecto: una variable `BACKEND_URL` configurada en Railway no se inserta automáticamente en el código del navegador; primero hace falta implementar configuración de entorno durante el build o una configuración pública en tiempo de ejecución.

## API

Base local: `http://localhost:3000/api/v1`

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/health` | Comprueba el estado de la API |
| `GET`, `POST` | `/clientes` | Lista o crea clientes |
| `GET`, `PUT`, `DELETE` | `/clientes/:id` | Consulta, actualiza o elimina un cliente |
| `GET`, `POST` | `/entrenamientos` | Lista o crea entrenamientos |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/entrenamientos/:id` | Consulta, actualiza o elimina un entrenamiento |

Para permitir un origen distinto del frontend, define `FRONT_URL` en `Backend/.env`. Se aceptan varios orígenes separados por comas. El puerto del backend se configura con `PORT` y, si no se define, usa `3000`.

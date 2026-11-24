# Vóley

Aplicación sencilla para consultar ejercicios, eventos, artículos deportivos y entrenamientos de voleibol. Está organizada en vistas, servicios y rutas de Angular, siguiendo la estructura del repositorio de referencia.

## Iniciar el proyecto

Abre dos terminales desde la carpeta del proyecto:

```powershell
cd Backend
npm run dev
```

```powershell
cd Frontend
npm start
```

Abre `http://localhost:4200`. El backend expone los entrenamientos en `http://localhost:3000/api/v1/entrenamientos`.
Los registros de clientes y entrenamientos del backend se guardan en memoria y se reinician al apagarlo. Para permitir otro origen del frontend, define `FRONT_URL` en `Backend/.env`.

## Acceso de demostración

En la pantalla de acceso puedes crear una cuenta y luego iniciar sesión. Las cuentas y la sesión se guardan en el `localStorage` del navegador; la contraseña se almacena como hash derivado, no como texto.

Este acceso local es solo para una demostración o proyecto académico. No reemplaza una autenticación real: los datos pueden ser modificados o borrados desde el navegador. Para producción, la autenticación y las cuentas deben validarse en el servidor.

## Comandos

Desde `Frontend`: `npm run build` para compilar y `npm test -- --watch=false` para ejecutar pruebas.

Desde `Backend`: `npm run build` para compilar y `npm test` para compilar y probar la API.

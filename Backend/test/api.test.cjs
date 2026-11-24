const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { after, before, describe, it } = require('node:test');
const app = require('../dist/app').default;

let server;
let baseUrl;

before(async () => {
  server = createServer(app);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

async function request(path, method = 'GET', body) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('API', () => {
  it('reports health and returns JSON for unknown routes', async () => {
    const healthResponse = await request('/api/v1/health');
    const health = await healthResponse.json();
    assert.equal(healthResponse.status, 200);
    assert.equal(health.status, 'OK');
    assert.ok(health.timestamp);

    const missingResponse = await request('/api/v1/no-existe');
    assert.equal(missingResponse.status, 404);
    assert.equal((await missingResponse.json()).message, 'Ruta no encontrada.');
  });

  it('validates IDs and JSON bodies with clear client errors', async () => {
    const invalidId = await request('/api/v1/entrenamientos/no-es-id');
    assert.equal(invalidId.status, 400);
    assert.ok((await invalidId.json()).message);

    const invalidBody = await request('/api/v1/entrenamientos', 'POST', { nombre: '  ' });
    assert.equal(invalidBody.status, 400);
    assert.ok((await invalidBody.json()).message);

    const malformedJson = await fetch(`${baseUrl}/api/v1/entrenamientos`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    });
    assert.equal(malformedJson.status, 400);
    assert.ok((await malformedJson.json()).message);
  });

  it('creates, reads, updates, and deletes an exercise session', async () => {
    const createResponse = await request('/api/v1/entrenamientos', 'POST', {
      nombre: 'Prueba de API',
      descripcion: 'Sesión creada por las pruebas',
      fecha: '2026-12-01',
      duracion_minutos: 60,
    });
    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    assert.ok(created.id);

    const patchResponse = await request(
      `/api/v1/entrenamientos/${created.id}`,
      'PATCH',
      { duracion_minutos: 75 },
    );
    assert.equal(patchResponse.status, 200);
    assert.equal((await patchResponse.json()).duracion_minutos, 75);

    const getResponse = await request(`/api/v1/entrenamientos/${created.id}`);
    assert.equal(getResponse.status, 200);
    assert.equal((await getResponse.json()).nombre, 'Prueba de API');

    const deleteResponse = await request(`/api/v1/entrenamientos/${created.id}`, 'DELETE');
    assert.equal(deleteResponse.status, 204);

    const missingResponse = await request(`/api/v1/entrenamientos/${created.id}`);
    assert.equal(missingResponse.status, 404);
  });

  it('validates and manages clients', async () => {
    const invalidResponse = await request('/api/v1/clientes', 'POST', {
      nombre: 'Persona',
      apellido: 'Prueba',
      email: 'correo-invalido',
    });
    assert.equal(invalidResponse.status, 400);

    const createResponse = await request('/api/v1/clientes', 'POST', {
      nombre: 'Persona',
      apellido: 'Prueba',
      email: 'persona.prueba@example.com',
      edad: 25,
    });
    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();

    const deleteResponse = await request(`/api/v1/clientes/${created.id}`, 'DELETE');
    assert.equal(deleteResponse.status, 204);
  });
});

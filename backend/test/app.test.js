const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs/promises');
const path = require('node:path');
const { once } = require('node:events');
const app = require('../src/app');

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('o resumo do documento enviado aparece na listagem e o arquivo pode ser baixado', async (t) => {
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });

  const baseUrl = `http://localhost:${server.address().port}`;
  let uploadedId;
  t.after(async () => {
    if (uploadedId) {
      await fs.unlink(path.join(__dirname, '../storage', uploadedId)).catch(() => {});
    }
  });

  const missingSummary = new FormData();
  missingSummary.append('file', new Blob(['document']), 'document.txt');
  const rejectedUpload = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: missingSummary,
  });
  assert.strictEqual(rejectedUpload.status, 400);

  const formData = new FormData();
  formData.append('file', new Blob(['document contents']), 'document.txt');
  formData.append('description', 'Resumo do documento de teste.');
  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });
  assert.strictEqual(uploadResponse.status, 201);
  const { document } = await uploadResponse.json();
  uploadedId = document.id;
  assert.strictEqual(document.description, 'Resumo do documento de teste.');

  const listResponse = await fetch(`${baseUrl}/documents`);
  const { documents } = await listResponse.json();
  assert.strictEqual(documents.length, 1);
  assert.strictEqual(documents[0].description, 'Resumo do documento de teste.');
  assert.strictEqual(Object.hasOwn(documents[0], 'path'), false);

  const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  assert.strictEqual(await downloadResponse.text(), 'document contents');
});

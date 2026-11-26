const fs = require('node:fs/promises');
const path = require('node:path');
const documentService = require('../services/documentService');

const storagePath = path.join(__dirname, '../../storage');
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'Selecione um arquivo para enviar.' });
  }

  const filePath = getFilePath(req.file.filename);
  const description = typeof req.body.description === 'string'
    ? req.body.description.trim()
    : '';

  if (!description || description.length > 1000) {
    await fs.unlink(filePath).catch(() => {});
    return res.status(400).json({
      error: 'Informe um resumo de até 1000 caracteres para o documento.',
    });
  }

  try {
    const document = documentService.createDocument({
      id: req.file.filename,
      name: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      description,
    });

    return res.status(201).json({ document });
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    return next(error);
  }
}

function list(req, res) {
  return res.json({ documents: documentService.listDocuments() });
}

function download(req, res) {
  const document = documentService.getDocument(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(getFilePath(document.id), document.name);
}

function getFilePath(id) {
  if (!UUID_PATTERN.test(id)) {
    throw new Error('Identificador de arquivo inválido.');
  }
  return path.join(storagePath, id);
}

module.exports = { upload, list, download };

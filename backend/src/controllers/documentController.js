const fs = require('node:fs/promises');
const documentService = require('../services/documentService');

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'Selecione um arquivo para enviar.' });
  }

  const description = typeof req.body.description === 'string'
    ? req.body.description.trim()
    : '';

  if (!description || description.length > 1000) {
    await fs.unlink(req.file.path).catch(() => {});
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
      path: req.file.path,
    });

    return res.status(201).json({ document: toPublicDocument(document) });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    return next(error);
  }
}

function list(req, res) {
  const documents = documentService.listDocuments().map(toPublicDocument);
  return res.json({ documents });
}

function download(req, res) {
  const document = documentService.getDocument(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(document.path, document.name);
}

function toPublicDocument({ path, ...document }) {
  return document;
}

module.exports = { upload, list, download };

const documentRepository = require('../repositories/documentRepository');

function createDocument(document) {
  return documentRepository.create(document);
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocument(id) {
  return documentRepository.findById(id);
}

module.exports = { createDocument, listDocuments, getDocument };

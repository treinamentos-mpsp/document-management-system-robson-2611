const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const storagePath = path.join(__dirname, '../../storage');
fs.mkdirSync(storagePath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: storagePath,
    filename: (req, file, callback) => callback(null, crypto.randomUUID()),
  }),
});

const router = express.Router();

router.post('/upload', upload.single('file'), documentController.upload);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;

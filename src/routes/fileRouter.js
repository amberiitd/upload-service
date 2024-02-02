const express = require('express');
const { uploadFile, readFile } = require('../services/fileService');
const { upload } = require('../configs/storage_local');
const router = express.Router();

// Upload file route
router.post('/upload', upload.single('file'), uploadFile);

// Read file route
router.get('/:fileId', readFile);

// Error middleware
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

module.exports = router;

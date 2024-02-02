const mongoose = require("mongoose");

const FileMetadata = mongoose.model('FileMetadata', {
  fileId: String,
  fileName: String,
  createdAt: String,
  size: Number,
  fileType: String,
});

module.exports = { FileMetadata }
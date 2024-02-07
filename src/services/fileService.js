const uuid = require("uuid");
const { s3 } = require("../configs/storage_s3");
const { FileMetadata } = require("../models/file");

const uploadFile = async (req, res, next) => {
	const fileData = req.file;
	const fileName = req.body.fileName;
	if (!fileName) {
    console.log(req.body, fileData)
    next(Error("FileName required"));
    return;
  };
	const fileId = uuid.v4();

	const params = {
		Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
		Key: fileId,
		Body: fileData.buffer,
	};

	s3.upload(params, async (err, data) => {
		if (err) {
      console.error(err);
			return res.status(500).json({ error: "Error uploading file to S3" });
		}

		const metadata = {
			fileId: fileId,
			fileName: fileName,
			createdAt: new Date().toISOString(),
			size: fileData.size,
			fileType: fileData.mimetype,
		};

		// Save metadata to MongoDB
		const fileMetadata = new FileMetadata(metadata);
		await fileMetadata.save();

		return res.status(200).json({ fileId: fileId, metadata: metadata });
	});
};

const readFile = async (req, res, next) => {
  console.log("in the reader");
	const fileId = req.params.fileId;

  if (!fileId) {
    next(Error("File Id is required."));
    return;
  };

	const params = {
		Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
		Key: fileId,
	};

	s3.getObject(params, (err, data) => {
		if (err) {
      console.error(err);
			return res.status(404).json({ error: "File not found" });
		}

		return res.status(200).send(data.Body);
	});
};

module.exports = {
	uploadFile,
	readFile,
};

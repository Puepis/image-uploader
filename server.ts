import express from "express";
const app = express();
import aws = require('aws-sdk');
aws.config.update({ region: "ca-central-1" });
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const s3 = new aws.S3();

// Parse application/json
app.use(express.json({ limit: "20mb" }));

app.use(express.static("public"));

// Upload image to S3
app.post("/upload", (req, res) => {
  const { path, data } = req.body;
  const bytes = parseImageData(data);

  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: path,
    Body: Buffer.from(bytes),
    ContentType: "image/jpeg",
  };
  s3.upload(uploadParams)
    .promise()
    .then((value) => {
      res.status(200).send(value.Location);
    })
    .catch((e) => {
      console.error("S3 UPLOAD ERROR: ", e);
      res.sendStatus(401);
    });
});

// Delete image from S3
app.delete("/upload", (req, res) => {
  // The relative path of the file
  const path = req.headers["path"];
  const deleteParams = {
    Bucket: S3_BUCKET,
    Key: path,
  };

  s3.deleteObject(deleteParams)
    .promise()
    .then((_) => res.sendStatus(200))
    .catch((e) => {
      console.error("S3 DELETE OBJECT ERROR: ", e);
      res.sendStatus(401);
    });
});

// Parse the uploaded image data
const parseImageData = (str) => {
  const strBytes = str.substring(1, str.length - 1).split(", ");
  const numBytes = strBytes.map((value) => Number(value));
  return new Uint8Array(numBytes);
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Image upload service started on port ${PORT}`)
);

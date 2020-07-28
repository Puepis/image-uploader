const express = require("express");
const app = express();
const aws = require("aws-sdk");
aws.config.update({ region: "ca-central-1" });
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const s3 = new aws.S3();

// Parse application/json
app.use(express.json({ limit: '20mb' }));

app.use(express.static("public"));

app.post("/upload", (req, res) => {
  const { path, data } = req.body;
  const bytes = parseImageData(data);

  let uploadParams = {
    Bucket: S3_BUCKET,
    Key: path,
    Body: Buffer.from(bytes),
    ContentType: "image/jpeg"
  };
  s3.putObject(uploadParams)
    .promise()
    .then((value) => {
      res.status(200).send(value.Location)})
    .catch((e) => res.sendStatus(401));
});

// Pars the uploaded image data
function parseImageData(str) {
  const strBytes = str.substring(1, str.length).split(", ");
  const numBytes = strBytes.map((value) => Number(value));
  return new Uint8Array(numBytes);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Image upload service started on port ${PORT}`)
);

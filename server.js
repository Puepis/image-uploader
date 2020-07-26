const express = require('express')
const app = express()
const aws = require('aws-sdk')
aws.config.update({ region: 'ca-central-1'})
const S3_BUCKET = process.env.S3_BUCKET
const s3 = new aws.S3();

app.post('/upload', (req, res) => {

    const { path, data } = req.body;
    const bytes = parseImageData(data);

    let uploadParams = {
        Bucket: S3_BUCKET,
        Key: path,
        Body: Buffer.from(bytes),
        Metadata: { 'type' : 'jpg' } // TODO: get image type
    }

    try {
        const res = await s3.upload(uploadParams).promise();
        res.status(200).send(res.Location);
    } catch (e) {
        console.log(e);
        res.sendStatus(401);
    }
})

// Pars the uploaded image data
function parseImageData(str) {
    const strBytes = str.substring(1, str.length).split(', ');
    const numBytes = strBytes.map(value => Number(value));
    return new Uint8Array(numBytes);
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Image upload service started on port ${PORT}`))
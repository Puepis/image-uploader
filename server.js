const express = require('express')
const app = express()
const aws = require('aws-sdk')
aws.config.update({ region: 'ca-central-1'})
const S3_BUCKET = process.env.S3_BUCKET
const s3 = new aws.S3();

app.post('/upload', (req, res) => res.send('Hello World!'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Image upload service started on port ${PORT}`))
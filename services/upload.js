const fs = require('fs')
const path = require('path')
const aws = require('aws-sdk')
const { promisify } = require('util')

class UploadService {
  constructor() {
    this.s3 = new aws.S3()
  }

  destroyImage(key) {
    if (process.env.STORAGE_TYPE === 's3') {
      return this.s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key
        })
        .promise()
        .then((response) => {
          console.log(response.status)
        })
        .catch((response) => {
          console.log(response.status)
        })
    } else {
      return promisify(fs.unlink)(
        path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key)
      )
    }
  }
}

module.exports = UploadService

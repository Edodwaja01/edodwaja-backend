import SDK from 'aws-sdk';
import multer from 'multer';
const s3Client = new SDK.S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: '0oA5PTtBsR/cup7zgSWXvuzvF87mtNFNR4Kj595s',
    accessKeyId: 'AKIAVUCFPZSZ7GK72X6O',
  },
});
export const upload = multer({
  limits: 1024 * 1024 * 5,
  fileFilter: function (req, file, next) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      next(null, Boolean); // error - Null file excepted - true
    } else {
      next('Multer Error : File type not supported', false);
    }
  },
});
export const uploadToS3 = (fileData, imagePath) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: imagePath,
      Body: fileData,
    };
    s3Client.upload(params, (err, data) => {
      if (err) {
        console.log('Error in uploadToS3 function :' + err.message);
        reject(err.message);
      }
      return resolve(data);
    });
  });
};

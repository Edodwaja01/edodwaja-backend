import SDK from 'aws-sdk';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
const s3Client = new SDK.S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
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

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const cloudinaryUpload = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    
    if (!fileBuffer) {
      return reject(new Error('File buffer is required for upload'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = cloudinaryUpload;
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key, // Click 'View API Keys' above to copy your API key
  api_secret: config.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  // Upload an image
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });

    fs.unlink(path, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('Failed to delete!');
      }
    });

    return uploadResult;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error; // Re-throw the error so it can be handled upstream
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

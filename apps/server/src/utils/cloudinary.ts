import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: process.env.CLOUDINARY_FOLDER,
    });
    // Optimize delivery by resizing and applying auto-format and auto-quality
    let optimizeUrl;
    if (response?.public_id) {
      optimizeUrl = cloudinary.url(response?.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
      });
    }

    fs.unlinkSync(localFilePath);
    return optimizeUrl;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temprory file as the upload operation got failed
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;

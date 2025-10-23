const multer = require("multer");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const uploadDocument = 
multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    destination: (req, file, cb) => {
      cb(null, "temp/");
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadDocumentToCloudinary = async (filePath,id, fileType) => {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "pdfs",
      resource_type: "raw",
      public_id: `pdf-${Date.now()}`,
    });
console.log("Cloudinary Result : ", result);
    if(fileType === 'resume'){
      await userModel.findByIdAndUpdate(id, { resume: result.secure_url });
    }else if(fileType === 'jobDescription'){
      await userModel.findByIdAndUpdate(id, { jobDescription: result.secure_url });
    }
    return result.url;

}
module.exports = {  uploadDocument, uploadDocumentToCloudinary };

const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const { uploadDocumentToCloudinary } = require("../utils/uploadDocument");
const embeddings = require("../utils/generateEmbeddings");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const documentModel = require("../models/documentModel");
const userModel = require("../models/userModel");


const upload = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileType = req.body.fileType;
  const filePath = req.file.path;
  const documentUrl = await uploadDocumentToCloudinary(filePath , req.user.userId, fileType);


  const parser = pdfParse(fs.readFileSync(filePath));
  const docs = await parser
  
  const split = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });


  const texts = await split.splitText(docs.text);

  console.log("chunks : ", texts.length);

  let chunks = []

  await Promise.all(
    texts.map(async (text) => {
      const embedding = await embeddings.embedQuery(text);
      chunks.push({
        text,
        embedding,
        email: req.user.email,
        userId: req.user.userId,
        fileType
      });
    })
  );
  await documentModel.insertMany(chunks);


  // Delete the temporary file after upload
  fs.unlinkSync(filePath);

  res.status(200).json({ message: "File uploaded successfully" , documentUrl });
});  

const getDocumentUrl = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.status(200).json({ resume: user.resume, jobDescription: user.jobDescription });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const {fileType} = req.body;
  const document = await documentModel.deleteMany({ userId: req.user.userId, fileType });
  await userModel.findByIdAndUpdate(req.user.userId, { [fileType]: "" });
  res.status(200).json({ message: "Documents deleted successfully" });
});
 
module.exports = { upload , getDocumentUrl , deleteDocument};
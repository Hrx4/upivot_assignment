const express = require("express");
const {uploadDocument} = require("../utils/uploadDocument");
const { upload, getDocumentUrl, deleteDocument } = require("../controllers/documentControllers");
const jwtVerification = require("../middlewares/jwtVerification");
const router = express.Router();

router.post("/upload",jwtVerification,uploadDocument.single("file"), upload);
router.get("/getDocumentUrl", jwtVerification,  getDocumentUrl);
router.delete("/delete", jwtVerification,  deleteDocument);

module.exports = router;
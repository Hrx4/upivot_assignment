
const express = require("express");
const { generateChatQuestions, evaluateAnswer, getQuestions } = require("../controllers/chatControllers");
const jwtVerification = require("../middlewares/jwtVerification");
const router = express.Router();

router.post("/start",jwtVerification, generateChatQuestions)
router.get('/questions', jwtVerification, getQuestions);
router.post('/query', jwtVerification, evaluateAnswer);

module.exports = router;
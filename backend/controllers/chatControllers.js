const asyncHandler = require("express-async-handler");
const pdfParse = require("pdf-parse");
const { generateQuestions } = require("../utils/generateQuestions");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");
const embeddings = require("../utils/generateEmbeddings");
const documentModel = require("../models/documentModel");
const { generateScore } = require("../utils/generateScore");

const generateChatQuestions = asyncHandler(async (req, res) => {
  const UserId = req.user.userId;
  const chatExists = await chatModel.findOne({ userId: UserId });
  if (chatExists) {
    return res.status(200).json({ chat :chatExists });
  }
  const user = await userModel.findById(UserId)
  const path = user.resume;

  if (!path) {
    return res.status(400).json({ message: "No resume found for user" });
  }

  const parser = pdfParse(path);
    const docs = await parser
  const questions = await generateQuestions(docs.text);
  console.log("Generated Questions : ", questions);
  const chat = await chatModel.create({
    userId: UserId,
    questions: questions,
  })
  res.status(200).json({ chat });
});

const getQuestions = asyncHandler(async (req, res) => {
  const chat = await chatModel.findOne({ userId: req.user.userId });
  res.status(200).json({ chat });
});

const evaluateAnswer = asyncHandler(async (req, res) => {
    const {answer, questionId} = req.body;
    const answerEmbedding = await embeddings.embedQuery(answer);
    const currentChat = await chatModel.findOne({ userId: req.user.userId });
    const currentQuestion = currentChat.questions.id(questionId);
    console.log("Current Question : ", currentQuestion);
    let chunks = await documentModel.aggregate([
      {
        $vectorSearch: {
          queryVector: answerEmbedding,
          numCandidates: 768,
          limit: 2,
          path: "embedding",
          index: "vector_index",
        },
      },
    ]);
    console.log("Retrieved Chunks : ", chunks);
    chunks = chunks.map((chunk)=>  chunk.text)
        console.log("Chunks for evaluation : ", chunks);


    const evalution = await generateScore(answer , currentQuestion.question , chunks);

    currentQuestion.answer = answer;
    currentQuestion.score = evalution.score;
    currentQuestion.response = evalution.feedback;
    currentQuestion.reference = chunks;
    await currentChat.save();
    res.status(200).json({ message: "Answer evaluated successfully" , currentChat});
    // res.status(200).json({ message: "Answer evaluated successfully" });


})

module.exports = { generateChatQuestions , evaluateAnswer, getQuestions };
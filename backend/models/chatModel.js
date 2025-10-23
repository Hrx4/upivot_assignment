
const { response } = require("express");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId:{
    type :String
  },
  questions:{
    type: [
        {
            question: String,
            answer: String,
            score: Number,
            response: String,
            reference: [String],
        }
    ],
    require: true,
  },
  
});

module.exports = mongoose.model("chat", chatSchema);
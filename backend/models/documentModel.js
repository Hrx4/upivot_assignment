const mongoose = require("mongoose");


const documentSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
  },
  text: {
    type: String,
    require: true,
  },
  embedding: {
    type: Array,
    require: true,
  },
  fileType:{
    type: String,
  }
});

module.exports = mongoose.model("document", documentSchema);

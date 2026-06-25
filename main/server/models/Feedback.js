const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 피드백 작성자 UID
  feedback: { type: String, required: true }, // 피드백 내용
  timestamp: { type: Date, default: Date.now } // 작성 시간
});

module.exports = mongoose.model("Feedback", feedbackSchema);

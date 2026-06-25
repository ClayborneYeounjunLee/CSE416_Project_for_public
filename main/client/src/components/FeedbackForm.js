import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ userId }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!feedback) {
      alert("Please enter your feedback.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/feedback", {
        userId,
        feedback,
      });
      alert(response.data.message);
      setFeedback(""); // 입력창 초기화
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div>
      <h3>Submit Feedback</h3>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FeedbackForm;

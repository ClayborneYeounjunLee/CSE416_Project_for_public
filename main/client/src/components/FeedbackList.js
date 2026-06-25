import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feedback");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div>
      <h3>All Feedback</h3>
      {feedbacks.map((feedback) => (
        <div key={feedback._id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <p><strong>User ID:</strong> {feedback.userId}</p>
          <p><strong>Feedback:</strong> {feedback.feedback}</p>
          <p><strong>Timestamp:</strong> {new Date(feedback.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;

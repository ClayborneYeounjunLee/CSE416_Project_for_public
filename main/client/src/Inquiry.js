import React, { useState } from "react";
import axios from "axios";

const Inquiry = ({ user }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      await axios.post("http://localhost:8000/api/send-email", {
        from: user.email,
        message,
      });
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Inquiry Page</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your inquiry here..."
      />
      <button onClick={handleSend}>Send Inquiry</button>
    </div>
  );
};

export default Inquiry;

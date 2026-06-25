import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importing Router and Routes
import LoginPage from "./components/LoginPage";
import Profile from "./components/Profile";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import TravelPlan from "./components/TravelPlan";
import FinishedLoginPage from "./components/FinishedLoginPage";
import ProfileEdit from "./components/ProfileEdit";

const App = () => {
  const [user, setUser] = useState(null); // 사용자 상태
  const [isLoginFinished, setIsLoginFinished] = useState(false); // 로그인 완료 여부 상태

  const handleGetStarted = () => {
    setIsLoginFinished(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!user ? <LoginPage setUser={setUser} /> : !isLoginFinished ? <FinishedLoginPage user={user} onGetStarted={handleGetStarted} /> : <TravelPlan />}
        />
        <Route path="/travel-plan" element={<TravelPlan user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route 
          path="/finishedLoginPage" 
          element={<FinishedLoginPage user={user} onGetStarted={handleGetStarted} />} 
        />
        <Route path="/profileedit" element={<ProfileEdit user={user} />} />
        
      </Routes>
    </Router>
  );
};

export default App;

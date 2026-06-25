import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import "./FinishedLoginPage.css"; // Assuming CSS file for styling the page

const FinishedLoginPage = ({ user, onGetStarted }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleGetStartedClick = () => {
    onGetStarted(); // 상태 변경 호출
    navigate("/travel-plan"); // TravelPlan 페이지로 명시적 네비게이션
  };

  const handleImageClick = () => {
    navigate("/profile"); // Navigate to the Profile page
  };

  const handleTripPlannerClick = () => {
    navigate("/travel-plan"); // Navigate back to FinishedLoginPage
  };

  return (
    <div className="home-bf-sign-in">
      <div className="div">
        <div className="group">
          <div className="overlap-group">
            <div className="group-2">
              <p className="heading-AI-travel">
                <span className="text-wrapper">&#34;AI travel</span>
                <span className="span"> planner for a unique and unprecedented journey.&#34;</span>
              </p>
              <p className="p">
                Turn your long-debated travel plans into a schedule within minutes with Globird.
              </p>
              <div className="frame" onClick={handleGetStartedClick}>
                <div className="text-wrapper-2">Get Started</div>
              </div>
            </div>
            <img className="image" src="https://c.animaapp.com/Qu1sqoTT/img/image-5.png" alt="AI Travel" />
          </div>
        </div>
        <div className="group-3">
          <div className="frame-2">
          </div>
          <img className="img" src="https://c.animaapp.com/Qu1sqoTT/img/image-6@2x.png" alt="Travel" />
          <div className="mask-group-wrapper">
            <img
              className="mask-group"
              src={user.photoURL || "img/mask-group-1.png"}
              alt="Profile"
              onClick={handleImageClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedLoginPage;

import axios from "axios";
import React, { useState } from "react";
import { signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ setUser }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const firebaseUser = await signInWithGoogle();
      
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber || "Not Provided",
          country: "Unknown",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        setUser(userData);

        try {
          const response = await axios.post("http://localhost:8000/api/users", userData);
          console.log("User data saved:", response.data);
          
          // After successful login and data saving, navigate to FinishedLoginPage
          navigate("/FinishedLoginPage", { replace: true });
        } catch (error) {
          console.error("Failed to save user data:", error);
          setError("Error saving user data. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <div className="frame" onClick={() => setShowLoginModal(true)}>
                <div className="text-wrapper-2">Get Started</div>
              </div>
            </div>
            <img
              className="image"
              src="https://c.animaapp.com/Qu1sqoTT/img/image-5.png"
              alt="AI Travel"
            />
          </div>
        </div>
        <div className="group-3">
          <div className="frame-2">
          </div>
          <img
            className="img"
            src="https://c.animaapp.com/Qu1sqoTT/img/image-6@2x.png"
            alt="Travel"
          />
          <div className="sign-in-button" onClick={() => setShowLoginModal(true)}>
            <div className="text-wrapper-3">Sign In</div>
          </div>
        </div>

        {showLoginModal && (
          <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-content">
                <h2>Let's Start with Globird</h2>
                <p>To access all the functionalities and optimize speed for you</p>
                <button 
                  className={`google-login-button ${isLoading ? 'loading' : ''}`} 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {!isLoading && (
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        fill="#4285F4"
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                      />
                      <path
                        fill="#34A853"
                        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.043l3.007-2.336z"
                      />
                      <path
                        fill="#EA4335"
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.3C4.672 5.163 6.656 3.58 9 3.58z"
                      />
                    </svg>
                  )}
                  <span className="google-login-text">
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                </button>
                {error && <div className="error-message">{error}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
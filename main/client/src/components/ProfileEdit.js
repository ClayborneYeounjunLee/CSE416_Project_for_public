import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileEdit.css";
import { useNavigate } from 'react-router-dom';

const ProfileEdit = ({ user }) => {
  const navigate = useNavigate();
  // Initialize state with empty strings instead of null/undefined
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    country: "",
    address1: "",
    address2: "",
    email: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${user.uid}`);
        if (response.status === 200) {
          const userData = response.data;
          // Update all form fields with user data or empty string if null
          setFormData({
            displayName: userData.displayName || "",
            phoneNumber: userData.phoneNumber || "",
            country: userData.country || "",
            address1: userData.address1 || "",
            address2: userData.address2 || "",
            email: user.email || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Initialize form with user prop data
    setFormData(prev => ({
      ...prev,
      displayName: user.displayName || "",
      email: user.email || ""
    }));

    fetchUserData();
  }, [user.uid, user.displayName, user.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        address1: formData.address1,
        address2: formData.address2,
      };

      const response = await axios.put(`http://localhost:8000/api/users/${user.uid}`, updatedUser);
      if (response.status === 200) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleImageClick = () => {
    navigate("/finishedLoginPage");
  };

  const handleImageClickProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="manage-profile-page">
      <div className="topnavbar-af-signin">
        <div className="frame">
          <img className="img" src={require('./img/frame-2.svg').default} alt="Globird Logo" onClick={handleImageClick}/>
          <div className="text-wrapper" onClick={handleImageClick}>Globird</div>
        </div>
        <div className="div">
        </div>
        <div className="mask-group-wrapper-top">
          <img className="mask-group-top" src={user.photoURL || "img/mask-group-1.png"} alt="Profile" onClick={handleImageClickProfile}/>
        </div>
      </div>
      <div className="frame-3">
        <div className="text-wrapper-2">Manage Your Profile</div>
        <hr className="line" src="img/line-7.svg" alt="Line Divider" />
        <div className="frame-4">
          <div className="text-wrapper-3">Basic info</div>
          <p className="p">Some info may be visible to other people using Globird Services</p>
          <div className="group">
            <div className="overlap-group">
              <div className="mask-group-wrapper">
                <img className="mask-group" src={user.photoURL || "img/mask-group-1.png"} alt="Profile" />
              </div>
              <div className="image-wrapper">
                <img className="image" src="img/image-3.png" alt="Profile Edit Icon" />
              </div>
            </div>
            <div className="text-wrapper-4">Profile Picture</div>
          </div>
          <div className="group-2">
            <div className="component">
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-wrapper-4">Username</div>
          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="frame-4">
          <div className="text-wrapper-3">Other info</div>
          <div className="group-2">
            <div className="text-wrapper-4">Name</div>
            <div className="component">
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-4">Phone Number</div>
            <div className="component">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-6">Country</div>
            <div className="component">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-6">Address 1</div>
            <div className="component">
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-6">Address 2</div>
            <div className="component">
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-6">Email</div>
            <div className="component">
              <input
                type="text"
                name="email"
                value={formData.email}
                disabled
              />
            </div>
          </div>
        </div>
        <hr className="line" src="img/line-9.svg" alt="Line Divider" />
        <div className="frame-5">
          <button className="text-wrapper-7" onClick={handleSave}>Complete</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
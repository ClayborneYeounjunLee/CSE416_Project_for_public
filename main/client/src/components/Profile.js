import React, {useState, useEffect} from "react";
import axios from "axios";
import "./Profile.css"; // Assuming CSS file for styling the page
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHotel, faPlaneDeparture, faTrash, faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';

const Profile = ({user}) => {
    const navigate = useNavigate(); // Hook for navigation
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
    const [country, setCountry] = useState(user.country || "");
    const [address1, setAddress1] = useState(user.address1 || "");
    const [address2, setAddress2] = useState(user.address2 || "");
    const [trips, setTrips] = useState([]); // 빈 배열로 초기화
    const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부
    const [selectedTrip, setSelectedTrip] = useState(null); // 선택된 여행 계획 정보

    // 여행 계획 눌렀을 때 사진 나오게 하는거 임시 테스트
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);

    const handlePlaceClick = async (place) => {
        console.log("장소 클릭");
        const match = place.match(/: (.+?)(?: \(.+\))?$/); // ":" 이후 괄호를 제외한 텍스트 추출
        const formattedPlace = match
            ? match[1]
            : ""; // 추출된 텍스트가 없으면 빈 문자열
        console.log("장소 이름 : ", formattedPlace);
        setSelectedPlace(formattedPlace);

        const images = await fetchImagesFromUnsplash(formattedPlace); // Unsplash API 호출
        setImageUrls(images);

        setIsPopupOpen(true);
    };

    const handleDeleteTrip = async (tripId, e) => {
        e.stopPropagation(); // Prevent triggering the trip details popup

        try {
            const confirmed = window.confirm("Are you sure you want to delete this trip?");
            if (!confirmed) 
                return;
            
            const response = await axios.delete(
                `http://localhost:8000/api/trips/${tripId}`
            );

            if (response.status === 200) {
                // Remove the deleted trip from the state
                setTrips(trips.filter(trip => trip._id !== tripId));

                // If the deleted trip was being displayed in the popup, close it
                if (selectedTrip && selectedTrip._id === tripId) {
                    setShowPopup(false);
                }
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to delete trip. Please try again.');
        }
    };
    const extractLocations = (planText, destination) => {
      // 날짜 기준으로 일정 분리
      const days = planText.split(/- Day \d+:/).slice(1);
      
      return days.map(day => {
        // 각 줄을 분리하고 필터링
        const lines = day
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.includes('2024-') && !line.includes('Travel Concept'));
    
        // 위치 정보 추출
        const locations = lines.map(line => {
          // Location: 형식 처리 (Tokyo 데이터)
          if (line.includes('Location:')) {
            const locationPart = line.split('Location:')[1].split('(')[0].trim();
            return locationPart;
          }
          // 일반 형식 처리 (New York, San Francisco 데이터)
          else if (line.startsWith('-')) {
            const locationPart = line.substring(1).split(':')[0].trim();
            return locationPart;
          }
          return null;
        }).filter(loc => loc !== null);
    
        // 각 위치에 목적지 도시 추가
        const locationsWithCity = locations.map(loc => `${loc}, ${destination}`);
        console.log(`Locations for day: ${locationsWithCity}`);
        return locationsWithCity;
      });
    };
    
    const createRouteUrl = (locations) => {
      if (!locations || locations.length === 0) return '';
      
      try {
        let url = 'https://www.google.com/maps/dir/?api=1';
        
        url += `&origin=${encodeURIComponent(locations[0])}`;
        url += `&destination=${encodeURIComponent(locations[locations.length - 1])}`;
        
        if (locations.length > 2) {
          const waypoints = locations.slice(1, -1)
            .map(loc => encodeURIComponent(loc))
            .join('|');
          url += `&waypoints=${waypoints}`;
        }
        
        url += '&travelmode=driving';
        return url;
      } catch (error) {
        console.error('Error creating route URL:', error);
        return '';
      }
    };
    
    const renderRouteButtons = (plan, destination) => {
      const dailyLocations = extractLocations(plan, destination);
      
      if (!dailyLocations || dailyLocations.length === 0) return null;
    
      return dailyLocations.map((locations, index) => {
        if (!locations || locations.length === 0) return null;
    
        const url = createRouteUrl(locations);
        if (!url) return null;
    
        return (
          <button
            key={index}
            className="route-button"
            onClick={(e) => {
              e.preventDefault();
              window.open(url, '_blank');
            }}
          >
            <FontAwesomeIcon icon={faMapMarkedAlt} className="button-icon" />
            Day {index + 1} Route
          </button>
        );
      }).filter(button => button !== null);
    };


    const fetchImagesFromUnsplash = async (query) => {
        const accessKey = '7aiRUynMD_nD3iYdmLGl3oZsjVBQuv9US4zZSKVPQfQ'; // Access Key
        const url = `https://api.unsplash.com/search/photos`;

        try {
            const response = await axios.get(url, {
                params: {
                    query, // 검색어
                    per_page: 2, // 한 번에 5개의 이미지 요청
                },
                headers: {
                    Authorization: `Client-ID ${accessKey}`, // API 키를 헤더에 포함
                }
            });

            return response
                .data
                .results
                .map(photo => photo.urls.small); // 작은 크기 이미지 URL 반환
        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
            return [];
        }
    };

    // 여행 사진 나오게 하기 테스트 여기까지
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 사용자 정보 가져오기
                const response = await axios.get(`http://localhost:8000/api/users/${user.uid}`);
                if (response.status === 200) {
                    const userData = response.data;
                    setPhoneNumber(userData.phoneNumber);
                    setCountry(userData.country);
                    setAddress1(userData.address1);
                    setAddress2(userData.address2);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        const fetchUserTrips = async () => {
            try {
                // 사용자 여행 계획 가져오기
                const response = await axios.get(
                    `http://localhost:8000/api/users/${user.uid}/trips`
                );
                if (response.status === 200) {
                    setTrips(response.data);
                }
            } catch (error) {
                console.error("Error fetching user trips:", error);
            }
        };

        fetchUserData();
        fetchUserTrips();
    }, [user.uid]);

    const handleLogout = () => {
        // Clear user session or token if applicable
        localStorage.removeItem('user'); // Example: remove user data from local storage
        window.location.href = "/"; // Redirect to the first page
    };

    const handleEdit = () => {
        navigate("/profileEdit"); // 프로필 수정 페이지로 리디렉션
    };

    const handleImageClick = () => {
        navigate("/finishedLoginPage"); // Navigate to the Finished Login page
    };

    const handleImageClickProfile = () => {
        navigate("/profile"); // Navigate to the Profile page
    };

    const handleTripPlannerClick = () => {
        navigate("/travel-plan"); // Navigate back to FinishedLoginPage
    };

    const handleTripClick = async (tripId) => {
        try {
            // 선택한 여행 계획의 상세 정보 가져오기
            const response = await axios.get(`http://localhost:8000/api/trips/${tripId}`);
            if (response.status === 200) {
                setSelectedTrip(response.data);
                setShowPopup(true); // 팝업 열기
            }
        } catch (error) {
            console.error("Error fetching trip detail:", error);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedTrip(null);
    };

    // 여행 일정을 파싱하는 함수
    const parseItinerary = (planText) => {
        const itinerary = [];
        const lines = planText.split('- Day ');
        let travelConcept = '';

        lines.forEach((line, index) => {
            line = line.trim();
            if (index === 0) {
                // 첫 번째 라인에서 Travel Concept 추출
                const conceptMatch = line.match(/Travel Concept: (.*)/);
                if (conceptMatch) {
                    travelConcept = conceptMatch[1].trim();
                }
            } else {
                const dayParts = line.split(' - ');
                const dayHeader = dayParts[0].trim();
                const dateMatch = dayHeader.match(/(\d{4}-\d{2}-\d{2})/);
                const date = dateMatch
                    ? dateMatch[1]
                    : '';
                const activities = dayParts
                    .slice(1)
                    .map(activity => activity.trim());
                itinerary.push({day: `Day ${index}`, date, activities});
            }
        });

        return {travelConcept, itinerary};
    };

    return (
        <div className="profile-page">
            <div className="topnavbar-af-signin">
                <div className="frame">
                    <img
                        className="img"
                        src={require('./img/frame-2.svg').default}
                        alt="Globird Logo"
                        onClick={handleImageClick}/>
                    <div className="text-wrapper" onClick={handleImageClick}>Globird</div>
                </div>
                <div className="div"></div>
                <div className="mask-group-wrapper-top">
                    <img
                        className="mask-group-top"
                        src={user.photoURL || "img/mask-group-1.png"}
                        alt="Profile"
                        onClick={handleImageClickProfile}/> {/* Clicking this image will navigate to Profile */}
                </div>
            </div>
            <div className="group">
                <div className="text-wrapper-2">Personal Info</div>
                <p className="p">Info about you and your preferences across Globird services</p>
                <p className="text-wrapper-3">Your Profile in Globird Service</p>
                <div className="overlap-group">
                    <p className="text-wrapper-4">
                        Personal info and options to manage it. You can make some of this info, like
                        your contact details, visible to others so they can reach you easily. You can
                        also see a summary of your profiles.
                    </p>
                    <hr className="line" src="img/line-6.svg" alt="Line Divider"/>
                </div>
                <div className="group-2">
                    <div className="group-3">
                        <div className="text-wrapper-5">Username</div>
                        <div className="text-wrapper-6">{user.displayName}</div>
                    </div>
                    <div className="text-wrapper-7">Basic info</div>
                    <p className="text-wrapper-8">Some info may be visible to other people using Globird Services</p>
                    <div className="group-4">
                        <div className="text-wrapper-5">Profile Picture</div>
                        <div className="mask-group-wrapper"><img
                            className="mask-group"
                            src={user.photoURL || "img/mask-group-1.png"}
                            alt="Profile"/></div>
                    </div>
                </div>
                <hr className="line-2" src="img/line-6.svg" alt="Line Divider"/>
                <div className="group-5">
                    <div className="group-7">
                        <div className="text-wrapper-5">ID</div>
                        <div className="text-wrapper-10">{user.uid}</div>
                    </div>
                    <div className="text-wrapper-7">Security info</div>
                    <p className="text-wrapper-8">
                        Your security information helps protect your account. Make sure to keep it
                        private and updated.
                    </p>
                </div>
                <hr className="line-3" src="img/line-10.svg" alt="Line Divider"/>
                <div className="group-8">
                    <div className="group-9">
                        <div className="text-wrapper-5">Name</div>
                        <div className="text-wrapper-11">{user.displayName}</div>
                    </div>
                    <div className="group-10">
                        <div className="text-wrapper-5">Phone Number</div>
                        <div className="text-wrapper-12">{phoneNumber}</div>
                    </div>
                    <div className="group-11">
                        <div className="text-wrapper-5">Address 1</div>
                        <div className="text-wrapper-13">{address1}</div>
                    </div>
                    <div className="group-12">
                        <div className="text-wrapper-5">Country</div>
                        <div className="text-wrapper-14">{country}</div>
                    </div>
                    <div className="group-13">
                        <div className="text-wrapper-5">Address 2</div>
                        <div className="text-wrapper-15">{address2}</div>
                    </div>
                    <div className="group-14">
                        <div className="text-wrapper-5">Email</div>
                        <div className="text-wrapper-16">{user.email}</div>
                    </div>
                    <div className="text-wrapper-7">Other info</div>
                </div>
                <hr className="line-4" src="img/line-10.svg" alt="Line Divider"/>
                <div
                    className="group-15"
                    style={{
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                    {
                        trips.length > 0
                            ? (trips.map((trip) => (
                                <div
                                    className="trip-item"
                                    key={trip._id}
                                    onClick={() => handleTripClick(trip._id)}>
                                    <div className="trip-info">
                                        <div className="trip-destination">{trip.destination}
                                            Trip</div>
                                        <div className="trip-date">{trip.startDate}</div>
                                    </div>
                                    <button className="delete-btn" onClick={(e) => handleDeleteTrip(trip._id, e)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            )))
                            : (<p>No saved trips found.</p>)
                    }
                </div>
                <hr className="line-5" src="img/line-10.svg" alt="Line Divider"/>
                <div className="frame-3a">
                    <button className="text-wrapper-21" onClick={handleEdit}>Edit</button>
                </div>
                <div className="frame-4">
                    <button className="text-wrapper-21" onClick={handleLogout}>Sign Out</button>
                </div>
                {
                    showPopup && selectedTrip && (

                        <div className="popup-overlay">
                            <div className="popup-content">
                                <button className="close-button" onClick={closePopup}>Close</button>
                                <h2>{selectedTrip.destination}
                                    Trip Details</h2>
                                {/* ... 기존 trip details ... */}
                                <h3>Itinerary:</h3>
                                <div className="itinerary">
                                    {
                                        (() => {
                                            const {travelConcept, itinerary} = parseItinerary(selectedTrip.plan);
                                            return (
                                                <div>
                                                    <p>
                                                        <strong>Travel Concept:</strong>
                                                        {travelConcept}</p>
                                                    {
                                                        itinerary.map((day, index) => (
                                                            <div key={index} className="day-plan">
                                                                <h4>{day.day}
                                                                    - {day.date}</h4>
                                                                <ul>
                                                                    {
                                                                        day
                                                                            .activities
                                                                            .map((activity, idx) => (
                                                                                <li
                                                                                    key={idx}
                                                                                    onClick={() => handlePlaceClick(activity)}
                                                                                    className="activity-item">
                                                                                    {activity}
                                                                                </li>
                                                                            ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            );
                                        })()
                                    }
                                </div>

                                {/* Route Buttons 추가 */}
                                <div className="route-buttons-container">
                                    {renderRouteButtons(selectedTrip.plan, selectedTrip.destination)}
                                </div>

                                {/* 기존 booking buttons */}
                                <div className="booking-buttons">
                                    {
                                        selectedTrip.hotelBookingUrl && (
                                            <button
                                                className="booking-button"
                                                onClick={() => window.open(selectedTrip.hotelBookingUrl, "_blank")}>
                                                <FontAwesomeIcon icon={faHotel} className="button-icon"/>
                                                Book Hotel
                                            </button>
                                        )
                                    }
                                    {
                                        selectedTrip.flightBookingUrl && (
                                            <button
                                                className="booking-button"
                                                onClick={() => window.open(selectedTrip.flightBookingUrl, "_blank")}>
                                                <FontAwesomeIcon icon={faPlaneDeparture} className="button-icon"/>
                                                Book Flight
                                            </button>
                                        )
                                    }
                                </div>
                            </div>

                            {
                                isPopupOpen && (
                                    <div className="popup">
                                        <div className="popup-content">
                                            <h2>{selectedPlace}</h2>
                                            <div className="images">
                                                {
                                                    imageUrls.length > 0
                                                        ? (
                                                            imageUrls.map((url, idx) => (<img key={idx} src={url} alt={`${selectedPlace} view`}/>))
                                                        )
                                                        : (<p>No images found</p>)
                                                }
                                            </div>
                                            <button onClick={() => setIsPopupOpen(false)}>Close</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Profile;

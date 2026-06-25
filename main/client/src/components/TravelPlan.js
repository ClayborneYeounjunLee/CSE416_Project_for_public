import React, { useState } from "react";
import axios from "axios";
import "./TravelPlan.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faPlaneDeparture, faSave, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';


const TravelPlan = ({user}) => {
  console.log("TravelPlan에서 전달된 user:", user);
  const navigate = useNavigate(); // navigate 정의 추가
  const [destination, setDestination] = useState("New York");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("");
  const [withWho, setWithWho] = useState("");
  const [activities, setActivities] = useState([]);
  const [options, setOptions] = useState([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [plan, setPlan] = useState("");
  const [hotelBookingUrl, setHotelBookingUrl] = useState("");
  const [flightBookingUrl, setFlightBookingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [preferences, setPreferences] = useState(""); 
  const [dailyLocations, setDailyLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);


// 수정된 위치 추출 함수
const extractLocations = (planText) => {
  const days = planText.split('- Day ').slice(1);
  return days.map(day => {
    // 각 줄을 분리하고 필터링
    const lines = day.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.includes('Day')); // 빈 줄과 Day 행 제거

    // 위치 정보 추출
    const locations = lines.map(line => {
      // '-' 로 시작하는 라인에서 위치 추출
      if (line.startsWith('-')) {
        // 괄호 안의 내용이 있다면 제거
        const locationPart = line.replace('-', '').trim();
        const mainLocation = locationPart.split('(')[0].trim();
        console.log('Extracted location:', mainLocation); // 디버깅용 로그
        return mainLocation;
      }
      return null;
    }).filter(loc => loc !== null);

    console.log(`Locations for day: `, locations); // 디버깅용 로그
    return locations;
  });
};

// URL 생성 함수 수정
const createRouteUrl = (locations, destination) => {
  if (!locations || locations.length === 0) {
    console.log('No locations found');
    return '';
  }
  
  try {
    // Base URL
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    // Add origin (first location)
    const origin = `${encodeURIComponent(locations[0])}, ${encodeURIComponent(destination)}`;
    url += `&origin=${origin}`;
    
    // Add destination (last location)
    const lastLocation = `${encodeURIComponent(locations[locations.length - 1])}, ${encodeURIComponent(destination)}`;
    url += `&destination=${lastLocation}`;
    
    // Add waypoints (intermediate locations)
    if (locations.length > 2) {
      const waypoints = locations.slice(1, -1)
        .map(loc => `${encodeURIComponent(loc)}, ${encodeURIComponent(destination)}`)
        .join('|');
      url += `&waypoints=${waypoints}`;
    }
    
    // Set travel mode to driving
    url += '&travelmode=driving';
    
    console.log('Generated Maps URL:', url); // 디버깅용 로그
    return url;
  } catch (error) {
    console.error('Error creating route URL:', error);
    return '';
  }
};

const renderRouteButtons = () => {
  console.log('Current dailyLocations:', dailyLocations); // 현재 저장된 위치 데이터 확인

  if (!dailyLocations || dailyLocations.length === 0) {
    console.log('No daily locations available');
    return null;
  }

  return dailyLocations.map((locations, index) => {
    console.log(`Locations for day ${index + 1}:`, locations); // 각 날짜별 위치 데이터 확인

    if (!locations || locations.length === 0) {
      console.log(`No locations for day ${index + 1}`);
      return null;
    }

    const url = createRouteUrl(locations, destination);
    console.log(`URL for day ${index + 1}:`, url); // 생성된 URL 확인

    return (
      <button
        key={index}
        className="route-button"
        onClick={() => {
          console.log(`Clicking route button for day ${index + 1}`);
          window.open(url, '_blank');
        }}
      >
        <FontAwesomeIcon icon={faMapMarkedAlt} className="button-icon" />
        Day {index + 1} Route
      </button>
    );
  }).filter(button => button !== null);
};

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!destination || !startDate || !withWho) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setPlan("");
    setHotelBookingUrl("");
    setFlightBookingUrl("");

    try {
      const response = await axios.post('http://localhost:8000/api/plan-trip', {
        destination,
        startDate,
        days,
        budget,
        withWho,
        activities,
        options,
        adults,
        children,
        preferences,
      });

      if (response.data && response.data.plan) {
        setPlan(response.data.plan);
        console.log('Raw plan data:', response.data.plan); // 전체 plan 데이터 로깅
        
        const locations = extractLocations(response.data.plan);
        console.log('Extracted all locations:', locations); // 추출된 모든 위치 정보 로깅
        
        setDailyLocations(locations);
        
        setHotelBookingUrl(
          `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${startDate}&checkout=${calculateCheckoutDate(startDate, days)}&group_adults=${adults}&group_children=${children}`
        );
        setFlightBookingUrl(
          `https://www.google.com/travel/flights?q=` +
          `Flights%20to%20${encodeURIComponent(destination)}` +
          `%20on%20${startDate}` +
          `${days > 0 ? `%20through%20${calculateCheckoutDate(startDate, days)}` : ''}` +
          `${adults > 1 ? `%20${adults}%20adults` : adults === 1 ? `%20${adults}%20adult` : ''}` +
          `${children > 0 ? `%20and%20${children}%20children` : ''}` +
          `%20economy` +
          `&curr=USD`
        );
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error generating travel plan:', error.response ? error.response.data : error.message);
      alert('Failed to generate travel plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handlePlaceClick = async (place) => {
    const formattedPlace = place.split(':')[0].trim(); // 장소 이름만 추출
    setSelectedPlace(formattedPlace);

    const images = await fetchImagesFromUnsplash(formattedPlace); // Unsplash API 호출
    setImageUrls(images);

    setIsPopupOpen(true);
    console.log('Popup State:', isPopupOpen);
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
        },
      });
  
      return response.data.results.map(photo => photo.urls.small); // 작은 크기 이미지 URL 반환
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  };
  
  // 여행 사진 나오게 하기 테스트 여기까지


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
        const dayParts = line.split('\n');
        const dayHeader = dayParts[0].trim();
        const activities = dayParts.slice(1).map(activity => activity.trim()).filter(activity => activity !== '');
        itinerary.push({
          day: `Day ${index}`,
          date: dayHeader,
          activities,
        });
      }
    });

    return { travelConcept, itinerary };
  };
  const handleImageClick = () => {
    navigate("/finishedLoginPage"); // Navigate to the Finished Login page
  }; //다시 메인페이지로 복귀

  const handleImageClickProfile = () => {
    navigate("/profile"); // Navigate to the Profile page
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  
  const handleSavePlan = async () => {
    try {
      const userId = user && user.uid ? user.uid : "guest";
      console.log("유저 정보 :", {user});
      
      // Include hotelBookingUrl and flightBookingUrl in the saved data
      await axios.post('http://localhost:8000/api/save-travel-plan', {
        user: userId,
        destination,
        startDate,
        days,
        budget,
        withWho,
        activities,
        options,
        adults,
        children,
        plan,
        hotelBookingUrl,  // Add this
        flightBookingUrl  // Add this
      });
      
      alert('Travel plan saved successfully!');
    } catch (error) {
      console.error('Error saving travel plan:', error.response ? error.response.data : error.message);
      alert('Failed to save travel plan. Please try again later.');
    }
  };

  const calculateCheckoutDate = (startDate, days) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="search-page">
      <div className="topnavbar-af-signin">
        <div className="frame">
          <img className="img" src={require('./img/frame-2.svg').default} alt="frame" onClick={handleImageClick} />
          <div className="text-wrapper" onClick={handleImageClick}>Globird</div>
        </div>
        <div className="div">
        </div>
        <div className="mask-group-wrapper-top">
          <img className="mask-group-top" src={user.photoURL || "img/mask-group-1.png"} alt="Profile" onClick={handleImageClickProfile}/>
        </div>
      </div>
      <div className="group">
        <p className="p">Tell us your travel preferences</p>
        <p className="text-wrapper-2">
          Just provide some basic information, and our trip planner will generate a customized itinerary based on your
          preferences.
        </p>
        <div className="destination-choice">
          <p className="text-wrapper-3">What is destination of choice?</p>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter Destination..."
            className="sample"
          />
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="planning-to-travel">
          <p className="text-wrapper-3">When are you planning to travel?</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="sample-2"
          />
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="how-many-days">
          <p className="text-wrapper-3">How many days are you planning to travel?</p>
          <div className="days-selector">
            <button type="button" onClick={() => setDays(days > 1 ? days - 1 : 1)}>–</button>
            <span className="text-wrapper-7">{days}</span>
            <button type="button" onClick={() => setDays(days + 1)}>+</button>
          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="budget">
          <p className="text-wrapper-3">The budget is exclusively allocated for activities and dining purposes.</p>
          <div className="budget-options">
          <div className="budget-options">
            <input
              type="radio"
              id="low"
              name="budget"
              value="Low"
              checked={budget === "Low"}
              onChange={(e) => setBudget(e.target.value)}
            />
            <label htmlFor="low">Low (0 - 1000 USD)</label>

            <input
              type="radio"
              id="medium"
              name="budget"
              value="Medium"
              checked={budget === "Medium"}
              onChange={(e) => setBudget(e.target.value)}
            />
            <label htmlFor="medium">Medium (1000 - 2500 USD)</label>

            <input
              type="radio"
              id="high"
              name="budget"
              value="High"
              checked={budget === "High"}
              onChange={(e) => setBudget(e.target.value)}
            />
            <label htmlFor="high">High (2500+ USD)</label>
          </div>

          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="with-who">
          <p className="text-wrapper-3">Who do you plan on traveling with your next adventure?</p>
          <div className="group-options">
            <input
              type="radio"
              id="solo"
              name="withWho"
              value="Solo"
              checked={withWho === "Solo"}
              onChange={(e) => setWithWho(e.target.value)}
            />
            <label htmlFor="solo">Solo</label>
            <input
              type="radio"
              id="couple"
              name="withWho"
              value="Couple"
              checked={withWho === "Couple"}
              onChange={(e) => setWithWho(e.target.value)}
            />
            <label htmlFor="couple">Couple</label>
            <input
              type="radio"
              id="family"
              name="withWho"
              value="Family"
              checked={withWho === "Family"}
              onChange={(e) => setWithWho(e.target.value)}
            />
            <label htmlFor="family">Family</label>
            <input
              type="radio"
              id="friends"
              name="withWho"
              value="Friends"
              checked={withWho === "Friends"}
              onChange={(e) => setWithWho(e.target.value)}
            />
            <label htmlFor="friends">Friends</label>
          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="number-of-travelers">
          <p className="text-wrapper-3">How many people are traveling?</p>
          <div className="travelers-selector">
            <div className="adults-selector">
              <label>Adults:</label>
              <button type="button" onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}>-</button>
              <span>{adults}</span>
              <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
            </div>
            <div className="children-selector">
              <label>Children:</label>
              <button type="button" onClick={() => setChildren(children > 0 ? children - 1 : 0)}>-</button>
              <span>{children}</span>
              <button type="button" onClick={() => setChildren(children + 1)}>+</button>
            </div>
          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <div className="activites-interested">
          <p className="text-wrapper-3">Which activities are you interested in?</p>
          <div className="activities-options">
            {[['Beaches', 'Festivals/Events', 'Outdoor Adventures', 'Shopping'], 
              ['City sightseeing', 'Food Exploration', 'Night Life', 'Spa wellness']
            ].map((group, index) => (
              <div className="activity-row" key={index}>
                {group.map(activity => (
                  <React.Fragment key={activity}>
                    <input
                      type="checkbox"
                      id={activity}
                      value={activity}
                      checked={activities.includes(activity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActivities([...activities, activity]);
                        } else {
                          setActivities(activities.filter(a => a !== activity));
                        }
                      }}
                    />
                    <label htmlFor={activity}>{activity}</label>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        {/* <div className="other-options">
          <p className="text-wrapper-3">Would you like to have these options?</p>
          <div className="options">
            {['Halal', 'Vegetarian'].map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={options.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setOptions([...options, option]);
                    } else {
                      setOptions(options.filter(o => o !== option));
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        </div> */}
        <div className="other-options">
          <p className="text-wrapper-3">Would you like to provide any additional preferences?</p>
          <div className="options">
            <textarea
              className="additional-preferences"
              placeholder="Enter any additional preferences or conditions here..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            ></textarea>
          </div>
        </div>

        <hr className="line" src="img/line-6.svg" alt="Line Divider" />
        <button type="submit" disabled={loading} className="frame-3" onClick={handleGeneratePlan}>
          {loading ? "Generating..." : "Submit"}
        </button>
        <div className="bottom-space"></div> {/* submit 버튼 밑 공간이 없어서 보기좀 그럼. 빈 공간 요소 추가 */}
        {/* {plan && (
          <div className="generated-plan">
            <h2 className="schedule-title">Schedule Created</h2>
            <p className="itinerary-title">{days}-Day {destination} Travel Itinerary</p>
            <div className="plan-content" dangerouslySetInnerHTML={{ __html: plan }}></div>
            <div className="booking-buttons">
              {hotelBookingUrl && (
                <button className="booking-button" onClick={() => window.open(hotelBookingUrl, '_blank')}>Book Hotel</button>
              )}
              {flightBookingUrl && (
                <button className="booking-button" onClick={() => window.open(flightBookingUrl, '_blank')}>Book Flight</button>
              )}
              <button className="save-button" onClick={handleSavePlan}>Save Plan</button>
            </div>
          </div>
        )} */}  

      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>×</button>
            <p className="itinerary-title">
              {days}-Day {destination} Travel Itinerary
            </p>
            <div className="plan-content">
              {(() => {
                const { travelConcept, itinerary } = parseItinerary(plan);
                return (
                  <div>
                    <p><strong>Travel Concept:</strong> {travelConcept}</p>
                    {itinerary.map((day, index) => (
                      <div key={index} className="day-plan">
                        <h3 className="day-title">{day.day} - {day.date}</h3>
                        <ul>
                          {day.activities.map((activity, idx) => (
                            <li key={idx} onClick={() => handlePlaceClick(activity)} className="activity-item">
                              {activity}
                            </li>
                          ))}
                        </ul>
                        {index < itinerary.length - 1 && <hr className="day-divider" />}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            
            {/* Route buttons */}
            <div className="route-buttons-container">
              {renderRouteButtons()}
            </div>

            {/* Booking buttons */}
            <div className="booking-buttons">
              {hotelBookingUrl && (
                <button className="booking-button" onClick={() => window.open(hotelBookingUrl, "_blank")}>
                  <FontAwesomeIcon icon={faHotel} className="button-icon" />
                  Book Hotel
                </button>
              )}
              {flightBookingUrl && (
                <button className="booking-button" onClick={() => window.open(flightBookingUrl, "_blank")}>
                  <FontAwesomeIcon icon={faPlaneDeparture} className="button-icon" />
                  Book Flight
                </button>
              )}
              <button className="save-button" onClick={handleSavePlan}>
                <FontAwesomeIcon icon={faSave} className="button-icon" />
                Save Plan
              </button>
            </div>
          </div>

          {/* Image popup */}
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <h2>{selectedPlace}</h2>
                <div className="images">
                  {imageUrls.length > 0 ? (
                    imageUrls.map((url, idx) => (
                      <img key={idx} src={url} alt={`${selectedPlace} view`} />
                    ))
                  ) : (
                    <p>No images found</p>
                  )}
                </div>
                <button onClick={() => setIsPopupOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelPlan;

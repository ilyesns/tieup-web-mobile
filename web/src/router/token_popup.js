import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Updated import statement
import { useAuth } from "../hooks/auth_context"; // Import the useAuth hook

const TokenExpiredPopup = () => {
  const { currentUser } = useAuth(); // Access authentication context
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkTokenValidity = () => {
      if (currentUser.accessToken) {
        const decodedToken = jwtDecode(currentUser.accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      }
    };

    checkTokenValidity();

    const intervalId = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentUser.accessToken]);

  const handleRefreshPage = () => {
    window.location.reload();
  };
  if (!showPopup) return null;
  return (
    <>
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <p>
              Your session has expired. Please refresh the page to continue.
            </p>
            <button onClick={handleRefreshPage}>Refresh</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenExpiredPopup;

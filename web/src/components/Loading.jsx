import React from "react";
import loadingImage from "../assets/images/loadingg.gif";
const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={loadingImage}></img>
    </div>
  );
};

export default LoadingPage;

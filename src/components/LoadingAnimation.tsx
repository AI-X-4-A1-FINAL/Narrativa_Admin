import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Lottie animationData={loadingAnimation} loop={true} className="w-64 h-64" />
    </div>
  );
};

export default LoadingAnimation;

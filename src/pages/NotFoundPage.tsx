import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import NotFoundPageAnimation from "../assets/animations/404.json";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Lottie animationData={NotFoundPageAnimation} loop={true} className="w-64 h-64" />
      <p className="text-lg font-nanum text-gray-600 mb-8">🚨경로를 찾을수 없습니다. 올바른 페이지로 이동하세요.🚨</p>
      <Link to="/" className="font-nanum text-blue-500 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;

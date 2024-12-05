import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/images/header-logo.svg";
import { useAuth } from "../auth/AuthContext";

const Header: React.FC = () => {
  const { admin, resetLogoutTimer, logoutStartTime } = useAuth();
  const adminName = admin?.username || "Admin";
  const [remainingTime, setRemainingTime] = useState<number>(1800);

  useEffect(() => {
    if (logoutStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - logoutStartTime) / 1000);
        setRemainingTime(1800 - elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [logoutStartTime]);

  const handleResetTimer = () => {
    resetLogoutTimer();
    setRemainingTime(1800);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <header className="w-full h-[8vh] flex items-center justify-between px-4 bg-black">
      {/* 왼쪽: 로고 */}
      <Link to="/" className="flex items-center gap-x-4">
        <img src={HeaderLogo} alt="Header Logo" className="w-5 h-[26px]" />
        <div className="text-xl font-normal text-white font-calistoga">
          NARRATIVA - ADMIN
        </div>
      </Link>

      {/* 오른쪽: 관리자 정보 */}
      <div className="flex items-center gap-x-4">
      <span 
          className={`text-sm font-medium font-nanum ${remainingTime <= 300 ? 'text-red-500 animate-bounce' : 'text-white'}`}
        >
          남은 시간: {formatTime(remainingTime)}분
        </span>
        <button 
          onClick={handleResetTimer} 
          className="text-white bg-pointer2 hover:bg-pointer px-3 py-1 rounded"
        >
          연장
        </button>
        <span className="text-white text-sm font-medium font-nanum">{adminName}</span>
      </div>
    </header>
  );
};

export default Header;

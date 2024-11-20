import React from "react";
import { Link } from "react-router-dom";
import HeaderLogo from "../assets/images/header-logo.svg";

const Header: React.FC = () => {
  const adminName = "Admin Name";
  const profilePicture = "https://via.placeholder.com/40";

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
        <span className="text-white text-sm font-medium font-nanum">{adminName}</span>
        <img
          src={profilePicture}
          alt={`${adminName}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Statistics } from "../assets/images/statistics-icon.svg";
import { ReactComponent as User } from "../assets/images/user-icon.svg";
import { ReactComponent as Notice } from "../assets/images/notice-icon.svg";
import { ReactComponent as Logout } from "../assets/images/logout-icon.svg";
import { ReactComponent as Mascot } from "../assets/images/side-mascot.svg";

const Sidebar: React.FC = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <div className="h-[calc(90vh)] w-[20%] min-w-[250px] max-w-[300px] bg-main flex flex-col items-center p-5 gap-12">
      {/* Version */}
      <div className="absolute bottom-12 text-sm font-gothic text-gray-500">V 0.0.1</div>

      {/* Menu List */}
      <div className="w-[230px] bg-white rounded-lg flex flex-col gap-3 p-2">
        {/* Menu Item: 통계 및 조사 */}
        <Link
          to="/"
          className={`flex justify-between items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <Statistics
              className={`w-5 h-5 ${
                location.pathname === "/" ? "text-white" : "text-gray-800 group-hover:text-white"
              }`}
            />
            <span className="text-sm font-gothic font-semibold">
              데이터 및 통계 분석
            </span>
          </div>
        </Link>

        {/* Menu Item: 회원 관리 */}
        <Link
          to="/user-management"
          className={`flex justify-between items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/user-management"
              ? "bg-pointer text-white"
              : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <User
              className={`w-5 h-5 ${
                location.pathname === "/user-management" ? "text-white" : "text-gray-800 group-hover:text-white"
              }`}
            />
            <span className="text-sm font-gothic font-semibold">
              회원 관리
            </span>
          </div>
        </Link>

        {/* Menu Item: 공지 관리 */}
        <Link
          to="/notice-management"
          className={`flex justify-between items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/notice-management"
              ? "bg-pointer text-white"
              : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <Notice
              className={`w-5 h-5 ${
                location.pathname === "/notice-management" ? "text-white" : "text-gray-800 group-hover:text-white"
              }`}
            />
            <span className="text-sm font-gothic font-semibold">
              공지 관리
            </span>
          </div>
        </Link>
      </div>

      {/* Logout */}
      <div className="w-[230px] bg-white rounded-lg flex items-center p-2 hover:bg-pointer group">
        <div className="flex items-center gap-4">
          <Logout className="w-5 h-5 text-gray-800 group-hover:text-white" />
          <span className="text-sm font-gothic font-semibold text-gray-800 group-hover:text-white">
            Log out
          </span>
        </div>
      </div>

      {/* Mascot */}
      <Mascot className="w-180 h-auto text-gray-800 group-hover:text-white" />
    </div>
  );
};

export default Sidebar;

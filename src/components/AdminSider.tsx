import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../components/AuthContext";
import { useToast } from "../hooks/useToast";
import { ReactComponent as Mascot } from "../assets/images/side-mascot.svg";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");

    showToast("로그아웃 완료!\n 안전하게 로그아웃되었습니다.", "success");

    navigate("/login");
  };

  return (
    <div className="h-[calc(90vh)] w-[20%] min-w-[80px] max-w-[300px] bg-main flex flex-col items-center p-5 gap-12">
      {/* Version */}
      <div className="absolute bottom-12 text-sm font-nanum font-bold text-gray-500">
        V 0.0.1
      </div>

      {/* Menu List */}
      <div className="w-full bg-white rounded-lg flex flex-col gap-3 p-2">
        <Link
          to="/"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/"
              ? "bg-pointer text-white"
              : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons w-5 h-5 group-hover:text-white ${
              location.pathname === "/" ? "text-white" : "text-gray-800"
            }`}
          >
            bar_chart
          </span>
          <span className="text-sm font-nanum font-bold ml-4 hidden lg:block">
            데이터 및 통계 분석
          </span>
        </Link>

        <Link
          to="/user-management"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/user-management"
              ? "bg-pointer text-white"
              : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons w-5 h-5 group-hover:text-white ${
              location.pathname === "/user-management"
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            person
          </span>
          <span className="text-sm font-nanum font-bold ml-4 hidden lg:block">
            회원 관리
          </span>
        </Link>

        <Link
          to="/notice-management"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/notice-management"
              ? "bg-pointer text-white"
              : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons w-5 h-5 group-hover:text-white ${
              location.pathname === "/notice-management"
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            campaign
          </span>
          <span className="text-sm font-nanum font-bold ml-4 hidden lg:block">
            공지 관리
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div
        className="w-full bg-white rounded-lg flex justify-center items-center p-2 hover:bg-pointer group cursor-pointer"
        onClick={handleLogout}
      >
        <span className="material-icons w-5 h-5 group-hover:text-white text-gray-800">
          logout
        </span>
        <span className="text-sm font-nanum font-bold text-gray-800 group-hover:text-white ml-4 hidden lg:block">
          Log out
        </span>
      </div>

      {/* Mascot */}
      <div className="hidden lg:block">
        <Mascot className="w-180 h-auto text-gray-800 group-hover:text-white" />
      </div>
    </div>
  );
};

export default Sidebar;

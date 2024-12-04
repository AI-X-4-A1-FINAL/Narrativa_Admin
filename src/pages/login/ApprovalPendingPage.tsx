import React from "react";
import useLogin from "../../hooks/useLogin";

const ApprovalPendingPage: React.FC = () => {
  const { handleLogout } = useLogin();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/admin-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/75 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur">
        <h1 className="text-2xl font-nanum font-bold text-pointer text-center mb-4">
          권한 승인 대기 중
        </h1>
        <p className="text-base font-nanum text-center mb-4">
          관리자 권한 승인이 완료될 때까지 기다려 주세요!
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 font-nanum text-white py-2 px-4 rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ApprovalPendingPage;

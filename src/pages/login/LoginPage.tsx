import React from "react";
import useLogin from "../../hooks/useLogin";

const LoginPage: React.FC = () => {
  const { handleLogin, handleRequestApproval, handleLogout, user } = useLogin();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/admin-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/75 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur">
        <h1 className="text-2xl font-bold text-center mb-4">관리자 로그인</h1>
        {user ? (
          <div className="text-center">
            <p className="text-sm mb-4">
              로그인된 이메일: <strong>{user.email}</strong>
            </p>
            <p className="text-sm mb-4">권한: {user.role || "대기 중"}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              로그아웃
            </button>
            {!user.role && (
              <button
                onClick={handleRequestApproval}
                className="w-full bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                관리자 권한 요청
              </button>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Google로 로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

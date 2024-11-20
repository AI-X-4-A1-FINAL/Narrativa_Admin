import React from 'react';
import { useAuth } from '../components/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    const mockUser = {
      id: '1',
      email: 'mockuser@example.com',
      name: '테스트 어드민 계정',
      role: 'admin' as const,
      provider: 'google' as const,
      profilePicture: 'https://via.placeholder.com/40',
    };
    login(mockUser);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">관리자 로그인</h1>
        <p className="text-sm text-center text-gray-500 mb-8">
          관리자 계정으로 로그인하세요.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

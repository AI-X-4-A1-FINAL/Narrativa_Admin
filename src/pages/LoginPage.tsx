import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useToast } from "../hooks/useToast";
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    const mockUser = {
      id: '1',
      email: 'mockuser@example.com',
      name: '테스트 계정',
      role: 'admin' as const,
      provider: 'google' as const,
      profilePicture: 'https://via.placeholder.com/40',
    };

    login(mockUser);

    showToast(`로그인 성공!\n ${mockUser.name}님 환영합니다!`, 'success');

    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-pointer"
      style={{
        backgroundImage: `url('/admin-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-pointer p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">관리자 로그인</h1>
        <p className="text-sm text-center text-white mb-8">
          관리자 계정으로 로그인하세요.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 px-4 rounded hover:bg-main hover:text-white"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

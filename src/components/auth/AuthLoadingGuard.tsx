import React from 'react';
import { useAuth } from './AuthContext';

export const AuthLoadingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">인증 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
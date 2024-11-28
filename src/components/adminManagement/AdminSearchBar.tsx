// src/components/admin/AdminSearchBar.tsx
import React, { useState } from "react";
import { Search, X, UserCog } from "lucide-react";
import { AdminSearchBarProps } from "../../types/admin";

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ searchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg
          border-2 shadow-sm
          ${
            isFocused 
              ? "border-blue-500 ring-4 ring-blue-50" 
              : "border-gray-200 hover:border-gray-300"
          }
          transition-all duration-200 ease-in-out`}
      >
        <div className="flex items-center gap-2 text-gray-400">
          <UserCog className="w-5 h-5" />
          <div className="w-px h-5 bg-gray-200" />
          <Search 
            className={`w-5 h-5 ${
              isFocused ? "text-blue-500" : "text-gray-400"
            }`}
          />
        </div>
        
        <input
          type="text"
          placeholder="관리자 이름 또는 이메일로 검색"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 검색 결과 카운트 표시 */}
      {searchTerm && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          {`검색어 "${searchTerm}"에 대한 결과`}
        </div>
      )}
    </div>
  );
};

export default AdminSearchBar;
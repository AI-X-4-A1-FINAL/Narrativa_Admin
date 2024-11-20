import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="w-full max-w-md">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg
          border-2 shadow-sm
          ${isFocused 
            ? "border-pointer ring-4 ring-blue-50" 
            : "border-pointer hover:border-gray-300"
          }
          transition-all duration-200 ease-in-out`}
      >
        <Search 
          className={`w-5 h-5 ${
            isFocused ? "text-pointer" : "text-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="회원 검색 (이름 또는 이메일)"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none font-nanum text-gray-700 placeholder-gray-400 bg-transparent"
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
    </div>
  );
};

export default SearchBar;
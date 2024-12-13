import React, { useState, useEffect, useCallback } from "react";
import PageLayout from "../../components/ui/PageLayout";
import { useMusicApi } from "../../hooks/useMusicApi";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import FileListTable from "../../components/music/FileListTable";

const MusicList: React.FC = () => {
    const {
        selectedGenre,
        genres,
        groupedFiles,
        filteredFiles,
        setSelectedGenre,
        fetchFiles,
        deleteMusic,
        isLoading
    } = useMusicApi();

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <PageLayout title="음악 관리">
            <div className="space-y-4 sm:space-y-6">
                {/* 장르 필터 버튼 */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="font-nanum font-bold text-lg sm:text-xl text-gray-700 mb-2 sm:mb-3">장르 필터</div>
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                        {genres
                            .filter(genre => genre !== 'UnKnown')
                            .map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-nanum text-xs sm:text-sm transition-colors
                                        text-center overflow-hidden
                                        ${selectedGenre === genre
                                            ? 'bg-pointer2 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="block truncate">
                                        {genre} ({groupedFiles[genre]?.length || 0})
                                    </span>
                                </button>
                            ))
                        }
                    </div>
                </div>

                {/* 파일 목록 */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[50dvh] sm:min-h-[60dvh] max-h-[50dvh] sm:max-h-[60dvh]">
                        <LoadingAnimation />
                    </div>
                ) : selectedGenre ? (
                    <div className="overflow-hidden">
                        <FileListTable
                            files={filteredFiles}
                            onDelete={deleteMusic}
                        />
                    </div>
                ) : (
                    <div className="min-h-[50dvh] sm:min-h-[60dvh] max-h-[50dvh] sm:max-h-[60dvh] flex justify-center items-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8">
                        <p className="text-center text-sm sm:text-base text-gray-500">장르를 선택하여 파일 목록을 확인하세요</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default MusicList;
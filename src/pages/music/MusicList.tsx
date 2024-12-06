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
            <div className="space-y-6">
                {/* 장르 필터 버튼 */}
                <div className="bg-white rounded-2xl p-4">
                    <div className="font-nanum font-bold text-xl text-gray-700 mb-3">장르 필터</div>
                    <div className="flex flex-wrap gap-2">
                        {genres
                            .filter(genre => genre !== 'UnKnown')
                            .map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded-full font-nanum text-sm transition-colors
                                        ${selectedGenre === genre
                                            ? 'bg-pointer2 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>
                                        {genre} ({groupedFiles[genre]?.length || 0})
                                    </span>
                                </button>
                            ))
                        }
                    </div>
                </div>

                {/* 파일 목록 */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[60dvh] max-h-[60dvh]">
                        <LoadingAnimation />
                    </div>
                ) : selectedGenre ? (
                    <div>
                        <FileListTable
                            files={filteredFiles}
                            onDelete={deleteMusic}
                        />
                    </div>
                ) : (
                    <div className="min-h-[60dvh] max-h-[60dvh] flex justify-center items-center bg-white rounded-2xl p-8">
                        <p className="text-center text-gray-500">장르를 선택하여 파일 목록을 확인하세요</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default MusicList;
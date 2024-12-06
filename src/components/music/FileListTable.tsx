import React from 'react';
import { MusicFile } from '../../types/music';

interface FileListTableProps {
    files: MusicFile[];
    onDelete: (filename: string) => void;
}

const getGenreColor = (genre: string) => {
    switch (genre) {
        case 'MYSTERY':
            return 'bg-purple-100 text-purple-800';
        case 'SURVIVAL':
            return 'bg-red-100 text-red-800';
        case 'ROMANCE':
            return 'bg-pink-100 text-pink-800';
        case 'SIMULATION':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

const FileListTable: React.FC<FileListTableProps> = ({ files, onDelete }) => {
    return (
        <div className="bg-white min-h-[60dvh] max-h-[60dvh] rounded-2xl overflow-auto flex flex-col">
            {/* 고정 헤더 */}
            <div className="sticky top-0 z-10">
                <div className="grid grid-cols-12 gap-4 bg-pointer2 px-6 py-3 border-b">
                    <div className="col-span-4 text-left text-xs font-nanum font-medium text-white uppercase">파일명</div>
                    <div className="col-span-2 text-left text-xs font-nanum font-medium text-white uppercase">장르</div>
                    <div className="col-span-2 text-left text-xs font-nanum font-medium text-white uppercase">크기</div>
                    <div className="col-span-3 text-left text-xs font-nanum font-medium text-white uppercase">수정일</div>
                    <div className="col-span-1 text-right text-xs font-nanum font-medium text-white uppercase">삭제</div>
                </div>
            </div>

            {/* 스크롤 가능한 본문 */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                    {files
                        .filter(file => !file.name.endsWith('/'))
                        .map((file) => (
                        <div key={file.name} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                            <div className="col-span-4 overflow-hidden text-ellipsis whitespace-nowrap">
                                <a
                                    href={file.presignedUrl}
                                    className="font-nanum text-blue-600 hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {file.name}
                                </a>
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-nanum text-xs font-medium ${getGenreColor(file.genre)}`}>
                                    {file.genre}
                                </span>
                            </div>
                            <div className="col-span-2 font-nanum text-gray-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <div className="col-span-3 font-nanum text-gray-600">
                                {new Date(file.lastModified).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 font-nanum text-right">
                                <button
                                    onClick={() => onDelete(file.name)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileListTable;
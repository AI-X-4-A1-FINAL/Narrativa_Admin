import React, { useCallback, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { X } from 'lucide-react';
import { FileUploadCardProps, Genre } from '../../types/music';
import { useToast } from '../../hooks/useToast';
import { formatGenre } from '../../utils/formatUtils';

const FileUploadCard: React.FC<FileUploadCardProps> = ({
    genres,
    selectedGenre,
    onGenreChange,
    onFileSelect
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { showToast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 폼 초기화 함수
    const resetForm = useCallback(() => {
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 파일 input 초기화
        }
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                if (file.size > 52428800) { // 50MB
                    showToast(`${file.name}의 크기가 50MB를 초과합니다.`, 'error');
                    return false;
                }
                if (!file.type.startsWith('audio/')) {
                    showToast(`${file.name}은 오디오 파일이 아닙니다.`, 'error');
                    return false;
                }
                return true;
            });

            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    }, [showToast]);

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            showToast('업로드할 파일을 선택해주세요.', 'error');
            return;
        }

        try {
            for (const file of selectedFiles) {
                await onFileSelect(file);
            }
            showToast('모든 파일이 업로드되었습니다.', 'success');
            resetForm(); // 업로드 성공 후 폼 초기화
        } catch (error) {
            showToast('일부 파일 업로드에 실패했습니다.', 'error');
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onGenreChange(e.target.value as Genre);
    };

    return (
        <Card className="w-[600px] mx-auto">
            <CardHeader>
                <CardTitle>음악 파일 업로드</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* 장르 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            장르
                        </label>
                        <select
                            value={selectedGenre}
                            onChange={handleGenreChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {formatGenre(genre)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 파일 업로드 영역 */}
                    <div className="min-h-[40dvh] max-h-[40dvh] mt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            multiple
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-pointer2 file:text-white
                                hover:file:bg-pointer1"
                        />
                    </div>

                    {/* 선택된 파일 목록 */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                선택된 파일 ({selectedFiles.length})
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                    >
                                        <span className="text-sm text-gray-600 truncate">
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 업로드 버튼 */}
                    {selectedFiles.length > 0 && (
                        <button
                            onClick={handleUpload}
                            className="w-full mt-4 px-4 py-2 bg-pointer2 text-white rounded-md
                                hover:bg-pointer1 transition-colors"
                        >
                            {selectedFiles.length}개 파일 업로드
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FileUploadCard;
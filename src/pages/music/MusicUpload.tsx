import React from "react";
import PageLayout from "../../components/ui/PageLayout";
import FileUploadCard from "../../components/music/FileUploadCard";
import { useMusicApi } from "../../hooks/useMusicApi";
import { useGenreSelect } from "../../hooks/useGenreSelect";
import { Genre } from "../../types/music";

const MusicUpload: React.FC = () => {
    const { uploadMusic } = useMusicApi();
    const { genres, selectedGenre, setSelectedGenre } = useGenreSelect();

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre as Genre);
    };

    const handleUpload = async (file: File) => {
        try {
            await uploadMusic(file, selectedGenre);
        } catch (error) {
            console.error('File upload error:', error);
        }
    };

    return (
        <PageLayout title="음악 버킷 업로드">
            <div className="flex justify-center px-4 sm:px-0">
                <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                    <FileUploadCard
                        genres={genres as Genre[]}
                        selectedGenre={selectedGenre}
                        onGenreChange={handleGenreChange}
                        onFileSelect={handleUpload}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default MusicUpload;
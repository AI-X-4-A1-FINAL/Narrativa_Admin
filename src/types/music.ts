export interface MusicFile {
    name: string;
    size: number;
    contentType: string;
    lastModified: string;
    presignedUrl: string;
    genre: string;
}

export type Genre = 'MYSTERY' | 'SURVIVAL' | 'ROMANCE' | 'SIMULATION';

export interface UploadMusicPayload {
    file: File;
    genre: Genre;
}

export interface FileUploadCardProps {
    genres: Genre[];
    selectedGenre: Genre;
    onGenreChange: (genre: Genre) => void;
    onFileSelect: (file: File) => Promise<void>;
}
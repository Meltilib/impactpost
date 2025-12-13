'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, FileVideo } from 'lucide-react';

interface VideoUploadProps {
    value?: string;
    onChange: (assetId: string | null, url: string | null) => void;
    onUpload: (file: File) => Promise<{ assetId: string; url: string } | null>;
}

export function VideoUpload({ value, onChange, onUpload }: VideoUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (value && value !== previewUrl && !isUploading) {
            setPreviewUrl(value);
        }
    }, [value, previewUrl, isUploading]);

    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('video/')) {
            alert('Please upload a video file');
            return;
        }

        // Sanity free tier limit is around 10MB-100MB depending on plan, but for safety lets warn > 50MB
        // Actually user can upload large files but function execution time might timeout.
        // Let's just try.
        if (file.size > 50 * 1024 * 1024) {
            const confirmUpload = window.confirm('This video is larger than 50MB. Upload might take a while or fail depending on your connection. Continue?');
            if (!confirmUpload) return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setIsUploading(true);

        try {
            const result = await onUpload(file);
            if (result) {
                onChange(result.assetId, result.url);
                setPreviewUrl(result.url); // Use remote URL
                URL.revokeObjectURL(localPreview); // Cleanup local
            } else {
                setPreviewUrl(null);
                onChange(null, null);
                alert('Failed to upload video');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setPreviewUrl(null);
            onChange(null, null);
            alert('Failed to upload video');
        } finally {
            setIsUploading(false);
        }
    }, [onChange, onUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const handleRemove = useCallback(() => {
        setPreviewUrl(null);
        onChange(null, null);
    }, [onChange]);

    return (
        <div
            className={`relative border-2 border-dashed transition-colors p-4 rounded-lg ${dragActive
                    ? 'border-brand-purple bg-brand-purple/5'
                    : 'border-gray-300 hover:border-gray-400'
                } ${previewUrl ? 'border-solid border-black' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
        >
            {previewUrl ? (
                <div className="relative aspect-video bg-black rounded overflow-hidden">
                    <video
                        src={previewUrl}
                        className="w-full h-full object-contain"
                        controls
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <div className="text-white font-bold flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                Uploading Video...
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-20"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
                    <FileVideo size={48} className="text-gray-400 mb-4" />
                    <p className="font-bold text-gray-700">Drop video here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">MP4, WebM up to 50MB</p>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}

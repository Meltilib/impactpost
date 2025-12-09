'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (assetId: string | null, previewUrl: string | null) => void;
  onUpload: (file: File) => Promise<{ assetId: string; url: string } | null>;
}

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Sync preview with value prop when it changes (e.g., on page load with initial data)
  useEffect(() => {
    if (value && value !== preview && !isUploading) {
      setPreview(value);
    }
  }, [value, preview, isUploading]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const result = await onUpload(file);
      if (result) {
        onChange(result.assetId, result.url);
        setPreview(result.url);
      } else {
        setPreview(null);
        onChange(null, null);
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setPreview(null);
      onChange(null, null);
      alert('Failed to upload image');
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
    setPreview(null);
    onChange(null, null);
  }, [onChange]);

  return (
    <div
      className={`relative border-2 border-dashed transition-colors ${
        dragActive 
          ? 'border-brand-purple bg-brand-purple/5' 
          : 'border-gray-300 hover:border-gray-400'
      } ${preview ? 'border-solid border-black' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="relative aspect-video">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white font-bold">Uploading...</div>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="font-bold text-gray-700">Drop image here or click to upload</p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

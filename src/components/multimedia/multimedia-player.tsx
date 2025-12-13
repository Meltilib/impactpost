'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MultimediaPlayerProps {
    mediaType: 'image' | 'video';
    thumbnailUrl: string;
    videoUrl?: string;
    title: string;
    categoryTitle: string;
    slug: string;
}

/**
 * Detects if a URL is a YouTube or Vimeo embed
 */
function getEmbedInfo(url: string): { type: 'youtube' | 'vimeo' | 'file'; embedUrl: string } | null {
    // YouTube patterns
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
        };
    }

    // Vimeo patterns
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        };
    }

    // Direct video file
    return { type: 'file', embedUrl: url };
}

export function MultimediaPlayer({
    mediaType,
    thumbnailUrl,
    videoUrl,
    title,
    categoryTitle,
    slug,
}: MultimediaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const embedInfo = videoUrl ? getEmbedInfo(videoUrl) : null;
    const isEmbed = embedInfo?.type === 'youtube' || embedInfo?.type === 'vimeo';

    const handlePlayClick = () => {
        if (mediaType === 'video' && videoUrl) {
            setIsPlaying(true);
            if (!isEmbed && videoRef.current) {
                videoRef.current.play();
            }
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    // If it's an image or we want to show the thumbnail before playing
    if (mediaType === 'image' || !isPlaying) {
        return (
            <div className="block relative group cursor-pointer">
                {/* Overlay with play button */}
                <div
                    onClick={handlePlayClick}
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center"
                >
                    {mediaType === 'video' && (
                        <div className="bg-brand-coral text-white p-4 rounded-full shadow-hard transition-transform group-hover:scale-110">
                            <Play size={32} fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Thumbnail image */}
                <div className="relative w-full h-[400px] border-2 border-black shadow-hard overflow-hidden">
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                </div>

                {/* Info card */}
                <Link
                    href={`/news/${slug}`}
                    className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-4 max-w-md z-20 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-brand-coral font-bold uppercase text-xs mb-1 block">
                        {categoryTitle}
                    </span>
                    <h3 className="font-bold text-xl">{title}</h3>
                </Link>
            </div>
        );
    }

    // Video is playing
    if (isEmbed && embedInfo) {
        // YouTube/Vimeo embed
        return (
            <div className="block relative">
                <div className="relative w-full h-[400px] border-2 border-black shadow-hard overflow-hidden">
                    <iframe
                        src={embedInfo.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title}
                    />
                </div>

                {/* Info card */}
                <Link
                    href={`/news/${slug}`}
                    className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-4 max-w-md z-20 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-brand-coral font-bold uppercase text-xs mb-1 block">
                        {categoryTitle}
                    </span>
                    <h3 className="font-bold text-xl">{title}</h3>
                </Link>
            </div>
        );
    }

    // Direct video file
    return (
        <div className="block relative group">
            <div className="relative w-full h-[400px] border-2 border-black shadow-hard overflow-hidden">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted={isMuted}
                    autoPlay
                    controls={false}
                    playsInline
                    onEnded={handlePause}
                />

                {/* Video controls overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                    <button
                        onClick={handlePause}
                        className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                        aria-label="Pause"
                    >
                        <Pause size={20} />
                    </button>
                    <button
                        onClick={toggleMute}
                        className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Info card */}
            <Link
                href={`/news/${slug}`}
                className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-4 max-w-md z-20 hover:bg-gray-50 transition-colors"
            >
                <span className="text-brand-coral font-bold uppercase text-xs mb-1 block">
                    {categoryTitle}
                </span>
                <h3 className="font-bold text-xl">{title}</h3>
            </Link>
        </div>
    );
}

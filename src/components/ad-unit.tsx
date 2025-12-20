import Image from 'next/image';
import { AdBanner } from '@/components/ui/ad-banner';
import { sanitizeUrl } from '@/lib/url-validator';

interface AdUnitProps {
    ad: {
        _id: string;
        image?: {
            asset?: {
                url?: string;
                metadata?: {
                    dimensions: {
                        width: number;
                        height: number;
                    };
                };
            };
            alt?: string;
        };
        title: string;
        destinationUrl?: string;
        disclosureText?: string;
    } | null;
    placement: 'homepage_leaderboard' | 'homepage_sidebar' | 'homepage_feed' | 'article_footer';
}

export function AdUnit({ ad, placement }: AdUnitProps) {
    // If no ad is provided, show the mock placeholder
    if (!ad || !ad.image?.asset?.url) {
        const formatMap: Record<string, 'leaderboard' | 'sidebar' | 'feed'> = {
            'homepage_leaderboard': 'leaderboard',
            'homepage_sidebar': 'sidebar',
            'homepage_feed': 'feed',
            'article_footer': 'leaderboard',
        };

        const format = formatMap[placement] || 'leaderboard';
        return <AdBanner format={format} />;
    }

    const imageUrl = ad.image.asset.url;
    // Security: Validate destination URL to prevent XSS from CMS content
    const linkUrl = ad.destinationUrl ? sanitizeUrl(ad.destinationUrl, '#') : '#';
    const disclosure = ad.disclosureText || 'Sponsored';

    // Styles based on placement - UPDATED SIZES & STYLES
    const containerClasses = {
        homepage_leaderboard: 'w-full max-w-[1200px] mx-auto my-4 flex flex-col items-center border-2 border-black shadow-hard h-[100px] md:h-[150px] bg-white',
        homepage_sidebar: 'w-full max-w-[300px] mx-auto my-4 flex flex-col items-center h-[250px] border-2 border-black shadow-hard bg-white',
        homepage_feed: 'w-full mx-auto my-4 flex flex-col items-center border-2 border-black shadow-hard h-[150px] md:h-[200px] bg-white',
        article_footer: 'w-full max-w-[1200px] mx-auto mt-8 mb-4 flex flex-col items-center border-2 border-black shadow-hard h-[100px] md:h-[150px] bg-white',
    };

    const imageClasses = {
        homepage_leaderboard: 'w-full h-full object-contain',
        homepage_sidebar: 'w-full h-full object-cover',
        homepage_feed: 'w-full h-full object-contain',
        article_footer: 'w-full h-full object-contain',
    };

    const currentContainerClass = containerClasses[placement] || containerClasses.homepage_leaderboard;
    const currentImageClass = imageClasses[placement] || imageClasses.homepage_leaderboard;

    // We can use the metadata dimensions if available, but we want to enforce the container constraints
    const width = ad.image?.asset?.metadata?.dimensions?.width || 1200;
    const height = ad.image?.asset?.metadata?.dimensions?.height || 150;

    // Calculate aspect ratio or fit

    const Content = (
        <div className="relative group w-full h-full overflow-hidden">
            <Image
                src={imageUrl}
                alt={ad.image.alt || ad.title}
                width={width}
                height={height}
                className={currentImageClass}
                priority={placement === 'homepage_leaderboard'}
            />
            <div className="absolute top-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 uppercase tracking-widest z-10">
                {disclosure}
            </div>
        </div>
    );

    if (ad.destinationUrl) {
        return (
            <div className={currentContainerClass}>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full hover:opacity-90 transition-opacity">
                    {Content}
                </a>
            </div>
        );
    }

    return (
        <div className={currentContainerClass}>
            {Content}
        </div>
    );
}

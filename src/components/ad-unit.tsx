import Image from 'next/image';

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
    placement: 'homepage_leaderboard' | 'homepage_sidebar' | 'article_footer';
}

export function AdUnit({ ad, placement }: AdUnitProps) {
    if (!ad || !ad.image?.asset?.url) return null;

    const imageUrl = ad.image.asset.url;
    const linkUrl = ad.destinationUrl || '#';
    const disclosure = ad.disclosureText || 'Sponsored';

    // Styles based on placement
    const containerClasses = {
        homepage_leaderboard: 'w-full max-w-[728px] mx-auto my-8 flex flex-col items-center',
        homepage_sidebar: 'w-full max-w-[300px] mx-auto my-6 flex flex-col items-center',
        article_footer: 'w-full max-w-[728px] mx-auto mt-12 mb-8 pt-8 border-t border-gray-200 flex flex-col items-center',
    };

    const imageClasses = {
        homepage_leaderboard: 'w-full h-auto max-h-[90px] object-contain',
        homepage_sidebar: 'w-full h-auto max-h-[600px] object-contain',
        article_footer: 'w-full h-auto max-h-[90px] object-contain',
    };

    const currentContainerClass = containerClasses[placement] || containerClasses.homepage_leaderboard;
    const currentImageClass = imageClasses[placement] || imageClasses.homepage_leaderboard;

    const width = ad.image?.asset?.metadata?.dimensions?.width || 728; // fallback width
    const height = ad.image?.asset?.metadata?.dimensions?.height || 90; // fallback height

    const Content = (
        <div className="relative group">
            <Image
                src={imageUrl}
                alt={ad.image.alt || ad.title}
                width={width}
                height={height}
                className={currentImageClass}
            />
            <div className="text-[10px] text-gray-400 uppercase tracking-widest text-center mt-1">
                {disclosure}
            </div>
        </div>
    );

    if (ad.destinationUrl) {
        return (
            <div className={currentContainerClass}>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
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

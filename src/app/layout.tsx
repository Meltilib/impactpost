import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Ticker } from '@/components/layout/ticker';
import { SITE_CONFIG } from '@/lib/constants';
import { isSanityEnabled } from '@/lib/sanity/client';
import './globals.css';

export const revalidate = 60;

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter/Inter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const archivoBlack = localFont({
  src: [
    {
      path: '../../public/fonts/archivo-black/ArchivoBlack-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-heavy',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/space-grotesk/SpaceGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/space-grotesk/SpaceGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: ['/icon.png', '/favicon.ico'],
    apple: { url: '/icon.png', sizes: '180x180' },
  },
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSanityEnabled && process.env.NODE_ENV !== 'production') {
    console.warn('[Sanity] NEXT_PUBLIC_USE_SANITY is false – rendering fallback seed content.');
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: SITE_CONFIG.name,
              alternateName: 'Impact Post Canada',
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}/icon.png`,
                width: 512,
                height: 512,
              },
              areaServed: {
                '@type': 'Country',
                name: 'Canada',
              },
              audience: {
                '@type': 'Audience',
                audienceType: 'Canadian-Somali diaspora',
              },
              sameAs: [
                `https://twitter.com/${SITE_CONFIG.twitterHandle.replace('@', '')}`,
                // Add other social profiles here as they become available
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@impactpost.ca',
                contactType: 'customer support',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-light font-sans antialiased selection:bg-brand-purple selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        <Ticker />
        <Header />
        {!isSanityEnabled && (
          <div className="bg-yellow-100 border-y-2 border-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
            Live Sanity data is disabled. You&apos;re viewing placeholder stories until NEXT_PUBLIC_USE_SANITY is enabled.
          </div>
        )}
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

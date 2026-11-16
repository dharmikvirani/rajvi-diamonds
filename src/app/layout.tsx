import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/db';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.brand_name} | Premium Fancy Cut Diamonds`,
      template: `%s | ${settings.brand_name}`,
    },
    description: settings.hero_subtitle || 'Premier fancy diamond manufacturer and supplier showcasing exceptional cuts, rare silhouettes, and artisanal lapidary excellence.',
    keywords: [
      'Rajvi Diamonds',
      'fancy cut diamonds',
      'rose octagone diamond',
      'tulip cut diamond',
      'geometric diamond cuts',
      'luxury diamond manufacturer',
      'bespoke jewellery diamonds',
      'wholesale fancy diamonds',
    ],
    authors: [{ name: 'Rajvi Diamonds' }],
    creator: 'Rajvi Diamonds',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title: `${settings.brand_name} | Premium Fancy Cut Diamonds`,
      description: settings.hero_subtitle,
      siteName: settings.brand_name,
      images: [
        {
          url: '/rajvi-diamonds-logo.png',
          width: 1536,
          height: 1024,
          alt: 'Rajvi Diamonds Brand',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.brand_name} | Premium Fancy Cut Diamonds`,
      description: settings.hero_subtitle,
      images: ['/rajvi-diamonds-logo.png'],
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
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-rajvi-offWhite text-rajvi-textDark font-sans antialiased selection:bg-rajvi-gold selection:text-rajvi-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

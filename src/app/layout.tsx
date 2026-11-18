import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { getSiteSettings, getSeoSettings } from '@/lib/db';

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
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoSettings()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  const defaultTitle = seo.default_title || `${settings.brand_name} | Premium Fancy Cut Diamonds`;
  const defaultDesc = seo.default_description || settings.hero_subtitle || 'Premier fancy diamond manufacturer and supplier showcasing exceptional cuts, rare silhouettes, and artisanal lapidary excellence.';
  const keywords = seo.default_keywords && seo.default_keywords.length > 0 ? seo.default_keywords : [
    'Rajvi Diamonds',
    'fancy cut diamonds',
    'rose octagone diamond',
    'tulip cut diamond',
    'geometric diamond cuts',
    'luxury diamond manufacturer',
    'bespoke jewellery diamonds',
    'wholesale fancy diamonds',
  ];
  const ogImage = seo.default_og_image || '/rajvi-diamonds-logo.png';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${settings.brand_name}`,
    },
    description: defaultDesc,
    keywords,
    authors: [{ name: settings.brand_name || 'Rajvi Diamonds' }],
    creator: settings.brand_name || 'Rajvi Diamonds',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title: defaultTitle,
      description: defaultDesc,
      siteName: settings.brand_name,
      images: [
        {
          url: ogImage,
          width: 1536,
          height: 1024,
          alt: `${settings.brand_name} Brand`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [ogImage],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvi-diamonds.vercel.app';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: settings.brand_name || 'Rajvi Diamonds',
    url: siteUrl,
    logo: `${siteUrl}/rajvi-diamonds-logo.png`,
    description: settings.hero_subtitle,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    telephone: settings.phone_number || settings.whatsapp_number,
    email: settings.contact_email,
    sameAs: [settings.instagram_url].filter(Boolean),
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-rajvi-offWhite text-rajvi-textDark font-sans antialiased selection:bg-rajvi-gold selection:text-rajvi-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

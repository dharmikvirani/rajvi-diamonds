import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import FeaturedCuts from '@/components/public/FeaturedCuts';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import CraftsmanshipSection from '@/components/public/CraftsmanshipSection';
import BrandStory from '@/components/public/BrandStory';
import InquiryCTA from '@/components/public/InquiryCTA';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getDiamonds, getSiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Rajvi Diamonds | The Art of Extraordinary Diamonds',
  description:
    'Discover distinctive fancy-cut diamonds from Rajvi Diamonds. Featuring Rose Octagone, Tulip, and calibrated millimeter fancy cuts crafted in Surat, India.',
  openGraph: {
    title: 'Rajvi Diamonds | The Art of Extraordinary Diamonds',
    description:
      'Discover distinctive fancy-cut diamonds from Rajvi Diamonds. Featuring Rose Octagone, Tulip, and calibrated millimeter fancy cuts crafted in Surat, India.',
    images: ['https://res.cloudinary.com/b2fsbbzr/image/upload/v1794978442/rose-octagone-cut.png'],
  },
};

export default async function HomePage() {
  const [settings, featuredDiamonds] = await Promise.all([
    getSiteSettings(),
    getDiamonds({ featured: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#0D0C0A] text-white flex flex-col selection:bg-rajvi-gold selection:text-[#0D0C0A]">
      {/* Header & Navigation */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
        theme="dark"
      />

      {/* 1. Hero Section */}
      <HeroSection
        heading={settings.hero_heading}
        subtitle={settings.hero_subtitle}
        imageUrl={settings.hero_image_url}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 2. Featured Diamond Collections */}
      <FeaturedCuts diamonds={featuredDiamonds} theme="dark" />

      {/* 3. Why Choose Rajvi Diamonds */}
      <WhyChooseUs />

      {/* 4. Our Craftsmanship */}
      <CraftsmanshipSection />

      {/* 5. About Rajvi Diamonds */}
      <BrandStory settings={settings} />

      {/* 6. Custom Diamond Enquiry CTA */}
      <InquiryCTA whatsappNumber={settings.whatsapp_number} />

      {/* 7. Footer */}
      <Footer settings={settings} theme="dark" />

      {/* Floating WhatsApp Quick Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </main>
  );
}

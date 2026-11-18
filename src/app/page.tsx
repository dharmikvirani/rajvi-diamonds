import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import FeaturedCuts from '@/components/public/FeaturedCuts';
import FeaturedShowcase from '@/components/public/FeaturedShowcase';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import CraftsmanshipSection from '@/components/public/CraftsmanshipSection';
import BrandStory from '@/components/public/BrandStory';
import ExploreCategories from '@/components/public/ExploreCategories';
import InstagramGallery from '@/components/public/InstagramGallery';
import InquiryCTA from '@/components/public/InquiryCTA';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getCategories, getDiamonds, getSiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Rajvi Diamonds | Premium Fancy Cut Diamonds',
  description:
    'Explore distinctive fancy-cut diamonds from Rajvi Diamonds. Discover Rose Octagone, Tulip and exceptional diamond craftsmanship.',
  openGraph: {
    title: 'Rajvi Diamonds | Premium Fancy Cut Diamonds',
    description:
      'Explore distinctive fancy-cut diamonds from Rajvi Diamonds. Discover Rose Octagone, Tulip and exceptional diamond craftsmanship.',
    images: ['/images/cuts.jpeg'],
  },
};

export default async function HomePage() {
  const [settings, categories, featuredDiamonds] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getDiamonds({ featured: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#0D0C0A] text-white flex flex-col selection:bg-rajvi-gold selection:text-[#0D0C0A]">
      {/* 1. Header / Navigation */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
        theme="dark"
      />

      {/* 2. Hero Section */}
      <HeroSection
        heading={settings.hero_heading}
        subtitle={settings.hero_subtitle}
        imageUrl={settings.hero_image_url}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 3. Featured Diamond Collection ("Explore Our Collections") */}
      <FeaturedCuts diamonds={featuredDiamonds} theme="dark" />

      {/* 4. Featured Product Showcase (Spotlight on Rose Octagone & Tulip) */}
      <FeaturedShowcase
        diamonds={featuredDiamonds}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 5. Why Choose Rajvi Diamonds ("Excellence in Every Detail") */}
      <WhyChooseUs />

      {/* 6. Our Craftsmanship Section ("The Art Behind Every Diamond") */}
      <CraftsmanshipSection />

      {/* 7. Explore Categories / Cut Families */}
      <ExploreCategories categories={categories} theme="dark" />

      {/* 8. Brand Story Section ("The Rajvi Diamonds Story") */}
      <BrandStory settings={settings} />

      {/* 9. Instagram / Visual Gallery ("Discover Our World") */}
      <InstagramGallery instagramUrl={settings.instagram_url} />

      {/* 10. Inquiry CTA Section ("Looking for Something Exceptional?") */}
      <InquiryCTA whatsappNumber={settings.whatsapp_number} />

      {/* 11. Footer */}
      <Footer settings={settings} theme="dark" />

      {/* Floating WhatsApp Quick Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </main>
  );
}

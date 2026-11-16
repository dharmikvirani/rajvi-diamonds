import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import FeaturedCuts from '@/components/public/FeaturedCuts';
import BrandStory from '@/components/public/BrandStory';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import ExploreCategories from '@/components/public/ExploreCategories';
import InquiryCTA from '@/components/public/InquiryCTA';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getCategories, getDiamonds, getSiteSettings } from '@/lib/db';

export const revalidate = 60; // Refresh data periodically

export default async function HomePage() {
  const [settings, categories, featuredDiamonds] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getDiamonds({ featured: true }),
  ]);

  return (
    <main className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
      {/* Premium Header */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
      />

      {/* Hero Section */}
      <HeroSection
        heading={settings.hero_heading}
        subtitle={settings.hero_subtitle}
        imageUrl={settings.hero_image_url}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* Featured Diamond Cuts */}
      <FeaturedCuts diamonds={featuredDiamonds} />

      {/* About Rajvi Diamonds */}
      <BrandStory settings={settings} />

      {/* Why Choose Rajvi Diamonds */}
      <WhyChooseUs />

      {/* Explore Collections / Categories */}
      <ExploreCategories categories={categories} />

      {/* Inquiry CTA */}
      <InquiryCTA whatsappNumber={settings.whatsapp_number} />

      {/* Premium Footer */}
      <Footer settings={settings} />

      {/* Floating WhatsApp Quick Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </main>
  );
}

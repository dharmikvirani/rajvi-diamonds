import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getSiteSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rajvi Diamonds',
  description: 'Rajvi Diamonds privacy policy, inquiry data handling, and confidentiality commitments for trade clients.',
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
      />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-rajvi-gold font-semibold block mb-2">
              Legal & Trust
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal">
              Privacy Policy & Client Data Confidentiality
            </h1>
            <p className="text-xs text-rajvi-textMuted mt-2">
              Last updated: January 2024
            </p>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textMuted leading-relaxed space-y-6">
            <section className="space-y-2">
              <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                1. Brand Commitment & Non-Commercial Discovery
              </h2>
              <p>
                Rajvi Diamonds (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates this showcase website exclusively to display fancy cut diamond geometries, manufacturing specifications, and artisanal capabilities. This platform is strictly a discovery catalogue and inquiry system, not an e-commerce purchasing portal.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                2. Information We Collect
              </h2>
              <p>
                We collect personal information solely when you voluntarily transmit a trade inquiry or contact us via WhatsApp, email, or our inquiry forms. This information may include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your full name and contact details (email address, phone / WhatsApp number).</li>
                <li>Your company or atelier name (if provided).</li>
                <li>Inquiry specifics (diamond cut of interest, preferred millimeter sizes, parcel requirements).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                3. Purpose of Data Processing
              </h2>
              <p>
                All data collected is utilized solely to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Respond directly to your diamond inquiry or parcel quotation request.</li>
                <li>Provide accurate cut specifications and workshop availability.</li>
                <li>Maintain confidential records of business-to-business communications.</li>
              </ul>
              <p>
                We do not sell, rent, monetize, or publicly disclose your contact information or project specifications to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                4. Data Security & Storage
              </h2>
              <p>
                Inquiries are securely stored within our encrypted PostgreSQL database infrastructure (powered by Supabase) equipped with strict Row Level Security (RLS). Only authenticated administrators have authorization to review inquiry records.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                5. Contact Regarding Your Data
              </h2>
              <p>
                If you wish to review, update, or request the deletion of your inquiry data from our records, please contact our privacy compliance desk directly at{' '}
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-rajvi-gold underline"
                >
                  {settings.contact_email}
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={settings} />

      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </div>
  );
}

import React from 'react';
import { getInquiriesAdmin, getSiteSettings } from '@/lib/db';
import InquiriesClient from './InquiriesClient';

export const dynamic = 'force-dynamic';

interface InquiriesPageProps {
  searchParams?: {
    id?: string;
  };
}

export default async function AdminInquiriesPage({ searchParams }: InquiriesPageProps) {
  const [inquiries, settings] = await Promise.all([
    getInquiriesAdmin(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-6">
      <InquiriesClient
        initialInquiries={inquiries}
        selectedInquiryId={searchParams?.id}
        whatsappNumber={settings.whatsapp_number}
      />
    </div>
  );
}

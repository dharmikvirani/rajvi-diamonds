'use client';

import React, { useState } from 'react';
import { Inquiry, InquiryStatus, InquiryType } from '@/lib/types';
import {
  Search,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  FileText,
  Save,
  X,
  Filter,
} from 'lucide-react';
import { formatDate, generateWhatsAppUrl } from '@/lib/utils';

interface InquiriesClientProps {
  initialInquiries: Inquiry[];
  selectedInquiryId?: string;
  whatsappNumber: string;
}

export default function InquiriesClient({
  initialInquiries,
  selectedInquiryId,
  whatsappNumber,
}: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Currently inspected inquiry
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(
    initialInquiries.find((i) => i.id === selectedInquiryId) || initialInquiries[0] || null
  );

  // Editable fields in inspection panel
  const [editableStatus, setEditableStatus] = useState<InquiryStatus>(
    activeInquiry?.status || 'New'
  );
  const [internalNotes, setInternalNotes] = useState<string>(
    activeInquiry?.internal_notes || ''
  );
  const [savingNote, setSavingNote] = useState(false);

  // When clicking another inquiry from list
  const handleSelectInquiry = (inq: Inquiry) => {
    setActiveInquiry(inq);
    setEditableStatus(inq.status);
    setInternalNotes(inq.internal_notes || '');
  };

  // Filter list
  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (typeFilter !== 'all' && inq.inquiry_type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inq.full_name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        (inq.company_name && inq.company_name.toLowerCase().includes(q)) ||
        (inq.diamond_name && inq.diamond_name.toLowerCase().includes(q)) ||
        inq.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Save updated status & internal note
  const handleSaveInquiry = async () => {
    if (!activeInquiry) return;
    setSavingNote(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_inquiry',
          payload: {
            id: activeInquiry.id,
            status: editableStatus,
            internalNotes,
          },
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === activeInquiry.id ? resJson.data : i))
        );
        setActiveInquiry(resJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const statusOptions: InquiryStatus[] = [
    'New',
    'Contacted',
    'In Progress',
    'Resolved',
    'Archived',
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-rajvi-borderDark/60">
        <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
          Client Communications
        </span>
        <h2 className="font-serif text-2xl font-normal text-rajvi-offWhite">
          Trade Inquiries & Leads
        </h2>
        <p className="text-xs text-rajvi-offWhite/60 mt-1">
          Review buyer requirements, update resolution statuses, and keep internal notes on parcel orders.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 p-4 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-rajvi-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, or cut..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
          >
            <option value="all">All Types</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Wholesale Inquiry">Wholesale Inquiry</option>
            <option value="Jewellery Manufacturing Inquiry">Jewellery Manufacturing</option>
            <option value="Diamond Availability">Diamond Availability</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: List of Inquiries */}
        <div className="lg:col-span-5 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm flex flex-col h-[700px]">
          <div className="p-3.5 bg-[#1F1E1A] border-b border-rajvi-borderDark/60 flex items-center justify-between text-xs text-rajvi-offWhite/80 font-medium">
            <span>Inquiries ({filtered.length})</span>
            <span className="text-[11px] text-rajvi-muted">Click to inspect</span>
          </div>

          <div className="divide-y divide-rajvi-borderDark/40 overflow-y-auto flex-1">
            {filtered.length > 0 ? (
              filtered.map((inq) => {
                const isSelected = activeInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rajvi-charcoal border-l-2 border-l-rajvi-gold'
                        : 'hover:bg-[#1C1A17]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-rajvi-offWhite truncate">
                        {inq.full_name}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded-sm font-semibold shrink-0 ${
                          inq.status === 'New'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rajvi-charcoal text-rajvi-offWhite/60 border border-rajvi-borderDark'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-rajvi-goldLight font-medium mb-1">
                      {inq.company_name ? `${inq.company_name} • ` : ''}
                      {inq.inquiry_type}
                    </div>

                    {inq.diamond_name && (
                      <div className="text-[10px] text-rajvi-gold mb-1 font-serif">
                        Cut: {inq.diamond_name} {inq.selected_size ? `(${inq.selected_size})` : ''}
                      </div>
                    )}

                    <p className="text-[11px] text-rajvi-offWhite/60 line-clamp-2 leading-relaxed mb-1">
                      {inq.message}
                    </p>

                    <span className="text-[10px] text-rajvi-muted block">
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-rajvi-muted">
                No inquiries matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Inspection & Internal Notes Panel */}
        <div className="lg:col-span-7 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          {activeInquiry ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="pb-4 border-b border-rajvi-borderDark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold">
                    Inquiry Details
                  </span>
                  <h3 className="font-serif text-2xl text-rajvi-offWhite font-normal">
                    {activeInquiry.full_name}
                  </h3>
                  {activeInquiry.company_name && (
                    <span className="text-xs text-rajvi-offWhite/70 block">
                      {activeInquiry.company_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[10px] uppercase text-rajvi-muted">Status:</label>
                  <select
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value as InquiryStatus)}
                    className="px-2.5 py-1 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs font-semibold text-rajvi-goldLight focus:outline-none focus:border-rajvi-gold"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#1F1E1A] p-4 rounded-sm border border-rajvi-borderDark/60">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-rajvi-gold shrink-0" />
                  <div>
                    <span className="text-[10px] text-rajvi-muted uppercase block">Email</span>
                    <a
                      href={`mailto:${activeInquiry.email}`}
                      className="text-rajvi-offWhite hover:text-rajvi-gold font-medium"
                    >
                      {activeInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-rajvi-gold shrink-0" />
                  <div>
                    <span className="text-[10px] text-rajvi-muted uppercase block">Phone</span>
                    <a
                      href={`tel:${activeInquiry.phone.replace(/\s+/g, '')}`}
                      className="text-rajvi-offWhite hover:text-rajvi-gold font-medium"
                    >
                      {activeInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Inquiry Type & Cut Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[10px] text-rajvi-muted uppercase block mb-1">
                    Inquiry Intent
                  </span>
                  <span className="font-semibold text-rajvi-offWhite">
                    {activeInquiry.inquiry_type}
                  </span>
                </div>

                <div className="p-3 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[10px] text-rajvi-muted uppercase block mb-1">
                    Diamond Cut
                  </span>
                  <span className="font-semibold text-rajvi-goldLight font-serif">
                    {activeInquiry.diamond_name || 'General Portfolio'}
                  </span>
                </div>

                <div className="p-3 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[10px] text-rajvi-muted uppercase block mb-1">
                    Requested Size
                  </span>
                  <span className="font-semibold text-rajvi-offWhite">
                    {activeInquiry.selected_size || 'Not Specified'}
                  </span>
                </div>
              </div>

              {/* Customer Message Body */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold">
                  Customer Message:
                </label>
                <div className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite/90 leading-relaxed whitespace-pre-line font-light">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Internal Notes (Private to Admin) */}
              <div className="space-y-2 pt-2 border-t border-rajvi-borderDark/60">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-rajvi-gold font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Private Internal Notes (Admin Only)</span>
                  </label>
                  <span className="text-[10px] text-rajvi-muted">
                    Not visible to the public or client
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Record parcel pricing discussions, follow-up timeline, client preferences, or stock allocation notes..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              {/* Quick Actions & Save Button */}
              <div className="pt-4 border-t border-rajvi-borderDark/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* WhatsApp Direct Reply */}
                  <a
                    href={`https://wa.me/${activeInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${activeInquiry.full_name}, thank you for contacting Rajvi Diamonds regarding your ${
                        activeInquiry.diamond_name || 'fancy diamond'
                      } inquiry.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Client</span>
                  </a>

                  {/* Mail Direct Reply */}
                  <a
                    href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(
                      `Rajvi Diamonds - Follow-up on your ${activeInquiry.diamond_name || 'inquiry'}`
                    )}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-rajvi-charcoal hover:bg-rajvi-borderDark text-rajvi-offWhite text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-rajvi-gold" />
                    <span>Send Email</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleSaveInquiry}
                  disabled={savingNote}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-goldGlow disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingNote ? 'Updating...' : 'Save Status & Notes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-rajvi-muted">
              Select an inquiry on the left to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

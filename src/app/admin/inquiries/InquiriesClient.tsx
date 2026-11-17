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
  Download,
  Trash2,
} from 'lucide-react';
import { formatDate, generateWhatsAppUrl } from '@/lib/utils';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/components/admin/AdminToast';

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
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

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
        showToast('Inquiry status and notes saved.', 'success');
      } else {
        throw new Error(resJson.error || 'Failed to update inquiry');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating inquiry', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  // Delete Inquiry handler
  const handleDeleteInquiry = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_inquiry',
          payload: { id: deleteTarget.id },
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        if (activeInquiry?.id === deleteTarget.id) {
          const remaining = inquiries.filter((i) => i.id !== deleteTarget.id);
          setActiveInquiry(remaining[0] || null);
          if (remaining[0]) {
            setEditableStatus(remaining[0].status);
            setInternalNotes(remaining[0].internal_notes || '');
          }
        }
        showToast('Inquiry deleted from database.', 'info');
      } else {
        throw new Error(resJson.error || 'Failed to delete inquiry');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting inquiry', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Export filtered inquiries to CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      showToast('No inquiries matching filters to export.', 'info');
      return;
    }

    const headers = [
      'Date',
      'Client Name',
      'Email',
      'Phone',
      'Company',
      'Inquiry Type',
      'Diamond Cut',
      'Carat / Size',
      'Color',
      'Clarity',
      'Status',
      'Message',
      'Internal Notes',
    ];

    const rows = filtered.map((i) => [
      `"${formatDate(i.created_at)}"`,
      `"${(i.full_name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company_name || '').replace(/"/g, '""')}"`,
      `"${(i.inquiry_type || '').replace(/"/g, '""')}"`,
      `"${(i.diamond_name || '').replace(/"/g, '""')}"`,
      `"${(i.selected_size || '').replace(/"/g, '""')}"`,
      `"${(i.selected_color || '').replace(/"/g, '""')}"`,
      `"${(i.selected_clarity || '').replace(/"/g, '""')}"`,
      `"${(i.status || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(i.internal_notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `rajvi_diamonds_inquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} inquiries to CSV spreadsheet.`, 'success');
  };

  const statusOptions: InquiryStatus[] = [
    'New',
    'Contacted',
    'Converted',
    'Closed',
    'Archived',
  ];

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-rajvi-borderDark/60">
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
          Client Communications
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight sm:tracking-normal">
          Trade Inquiries & Leads
        </h2>
        <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1.5">
          Review buyer requirements, update resolution statuses, and keep internal notes on parcel orders.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-rajvi-offWhite/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, or cut..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite placeholder:text-rajvi-offWhite/40 focus:outline-none focus:border-rajvi-gold transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
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
            className="px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
          >
            <option value="all">All Types</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Wholesale Inquiry">Wholesale Inquiry</option>
            <option value="Jewellery Manufacturing Inquiry">Jewellery Manufacturing</option>
            <option value="Diamond Availability">Diamond Availability</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark hover:border-rajvi-gold rounded-sm text-[13px] font-sans text-rajvi-goldLight hover:text-rajvi-gold font-medium transition-colors shrink-0"
            title="Download CSV spreadsheet of current inquiries"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: List of Inquiries */}
        <div className="lg:col-span-5 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm flex flex-col h-[720px]">
          <div className="p-4 bg-[#1F1E1A] border-b border-rajvi-borderDark/60 flex items-center justify-between text-[13px] font-sans text-rajvi-offWhite/80 font-medium">
            <span>Inquiries ({filtered.length})</span>
            <span className="text-[12px] text-rajvi-offWhite/50">Click to inspect</span>
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
                        : 'hover:bg-[#1E1C18]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-medium text-[14px] font-sans text-rajvi-offWhite truncate">
                        {inq.full_name}
                      </span>
                      <span
                        className={`text-[11px] font-sans uppercase px-2 py-0.5 rounded-sm font-semibold shrink-0 ${
                          inq.status === 'New'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rajvi-charcoal text-rajvi-offWhite/60 border border-rajvi-borderDark'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div className="text-[12px] font-sans text-rajvi-goldLight font-medium mb-1">
                      {inq.company_name ? `${inq.company_name} • ` : ''}
                      {inq.inquiry_type}
                    </div>

                    {(inq.diamond_name || inq.selected_color || inq.selected_clarity) && (
                      <div className="text-[12px] text-rajvi-gold mb-1 font-serif">
                        {inq.diamond_name ? `Cut: ${inq.diamond_name}` : ''}
                        {[
                          inq.selected_size || '',
                          inq.selected_color ? `Color ${inq.selected_color}` : '',
                          inq.selected_clarity || '',
                        ].filter(Boolean).length > 0 && ` (${[
                          inq.selected_size || '',
                          inq.selected_color ? `Color ${inq.selected_color}` : '',
                          inq.selected_clarity || '',
                        ].filter(Boolean).join(' • ')})`}
                      </div>
                    )}

                    <p className="text-[13px] font-sans text-rajvi-offWhite/65 line-clamp-2 leading-relaxed mb-1.5">
                      {inq.message}
                    </p>

                    <span className="text-[11px] font-sans text-rajvi-offWhite/50 block">
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-[13px] font-sans text-rajvi-offWhite/60">
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
              <div className="pb-5 border-b border-rajvi-borderDark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-rajvi-gold font-medium block mb-1">
                    Inquiry Details
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-rajvi-offWhite font-normal tracking-tight sm:tracking-normal">
                    {activeInquiry.full_name}
                  </h3>
                  {activeInquiry.company_name && (
                    <span className="text-[13px] font-sans text-rajvi-offWhite/70 block mt-0.5">
                      {activeInquiry.company_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[12px] font-sans uppercase text-rajvi-offWhite/60 font-medium">Status:</label>
                    <select
                      value={editableStatus}
                      onChange={(e) => setEditableStatus(e.target.value as InquiryStatus)}
                      className="px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans font-medium text-rajvi-goldLight focus:outline-none focus:border-rajvi-gold"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(activeInquiry)}
                    className="p-2 text-red-400/80 hover:text-red-400 hover:bg-red-950/30 rounded-sm transition-colors border border-transparent hover:border-red-800/40"
                    title="Delete Inquiry Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-sans bg-[#1F1E1A] p-4 rounded-sm border border-rajvi-borderDark/60">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-rajvi-gold shrink-0" />
                  <div>
                    <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block font-medium">Email</span>
                    <a
                      href={`mailto:${activeInquiry.email}`}
                      className="text-rajvi-offWhite hover:text-rajvi-gold font-medium transition-colors"
                    >
                      {activeInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rajvi-gold shrink-0" />
                  <div>
                    <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block font-medium">Phone</span>
                    <a
                      href={`tel:${activeInquiry.phone.replace(/\s+/g, '')}`}
                      className="text-rajvi-offWhite hover:text-rajvi-gold font-medium transition-colors"
                    >
                      {activeInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Inquiry Type & Cut Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px] font-sans">
                <div className="p-3.5 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block mb-1 font-medium">
                    Inquiry Intent
                  </span>
                  <span className="font-semibold text-rajvi-offWhite">
                    {activeInquiry.inquiry_type}
                  </span>
                </div>

                <div className="p-3.5 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block mb-1 font-medium">
                    Diamond Cut
                  </span>
                  <span className="font-serif text-[15px] font-normal text-rajvi-goldLight">
                    {activeInquiry.diamond_name || 'General Portfolio'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block mb-1 font-medium">
                    Requested Size
                  </span>
                  <span className="font-semibold text-rajvi-offWhite">
                    {activeInquiry.selected_size || 'Not Specified'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#1F1E1A] rounded-sm border border-rajvi-borderDark/40">
                  <span className="text-[11px] font-sans text-rajvi-offWhite/50 uppercase block mb-1 font-medium">
                    Color & Clarity
                  </span>
                  <span className="font-semibold text-rajvi-goldLight">
                    {[activeInquiry.selected_color ? `Color ${activeInquiry.selected_color}` : '', activeInquiry.selected_clarity].filter(Boolean).join(' • ') || 'Not Specified'}
                  </span>
                </div>
              </div>

              {/* Customer Message Body */}
              <div className="space-y-2">
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium">
                  Customer Message:
                </label>
                <div className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite/90 leading-relaxed whitespace-pre-line font-normal">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Internal Notes (Private to Admin) */}
              <div className="space-y-2 pt-3 border-t border-rajvi-borderDark/60">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-sans uppercase tracking-wider text-rajvi-gold font-medium flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Private Internal Notes (Admin Only)</span>
                  </label>
                  <span className="text-[11px] font-sans text-rajvi-offWhite/50">
                    Not visible to the public or client
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Record parcel pricing discussions, follow-up timeline, client preferences, or stock allocation notes..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite placeholder:text-rajvi-offWhite/40 focus:outline-none focus:border-rajvi-gold transition-colors leading-relaxed"
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
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[13px] font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Client</span>
                  </a>

                  {/* Mail Direct Reply */}
                  <a
                    href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(
                      `Rajvi Diamonds - Follow-up on your ${activeInquiry.diamond_name || 'inquiry'}`
                    )}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#1F1E1A] hover:bg-[#25231F] border border-rajvi-borderDark text-rajvi-offWhite text-[13px] font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-rajvi-gold" />
                    <span>Send Email</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleSaveInquiry}
                  disabled={savingNote}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-[13px] font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingNote ? 'Updating...' : 'Save Status & Notes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[13px] font-sans text-rajvi-offWhite/50">
              Select an inquiry on the left to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Trade Inquiry"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.full_name}"? All client details and messages will be permanently removed.`}
        confirmLabel="Delete Inquiry"
        isDestructive
        onConfirm={handleDeleteInquiry}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

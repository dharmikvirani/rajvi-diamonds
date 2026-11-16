import React from 'react';
import Link from 'next/navigation';
import { getDashboardStats } from '@/lib/db';
import StatsCard from '@/components/admin/StatsCard';
import {
  Gem,
  Layers,
  Inbox,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  Eye,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
            Executive Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite">
            Diamond Catalogue & Inquiries
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/diamonds/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Diamond Cut</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Active Diamond Cuts"
          value={stats.activeDiamonds}
          subValue={`${stats.totalDiamonds} total cuts recorded`}
          icon={Gem}
          badge={`${stats.activeDiamonds} Live`}
        />

        <StatsCard
          label="Featured Cuts"
          value={stats.featuredDiamonds}
          subValue="Displayed on homepage showcase"
          icon={Sparkles}
        />

        <StatsCard
          label="Cut Categories"
          value={stats.totalCategories}
          subValue="Organized geometric families"
          icon={Layers}
        />

        <StatsCard
          label="Customer Inquiries"
          value={stats.totalInquiries}
          subValue={`${stats.newInquiries} pending review`}
          icon={Inbox}
          badge={stats.newInquiries > 0 ? `${stats.newInquiries} New` : undefined}
        />
      </div>

      {/* Recent Inquiries Panel */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-rajvi-borderDark/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-normal text-rajvi-offWhite">
              Recent Trade Inquiries
            </h3>
            <p className="text-xs text-rajvi-offWhite/60 mt-0.5">
              Latest client requests for parcels, dimensions, and manufacturing availability
            </p>
          </div>

          <a
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-xs text-rajvi-gold hover:text-rajvi-goldLight font-semibold uppercase tracking-wider transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {stats.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F1E1A] text-rajvi-offWhite/60 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-6">Client / Atelier</th>
                  <th className="py-3 px-6">Inquiry Type</th>
                  <th className="py-3 px-6">Cut of Interest</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Received</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/80">
                {stats.recentInquiries.map((inq) => {
                  let statusBadgeClass = 'bg-blue-950/40 text-blue-400 border-blue-800/40';
                  if (inq.status === 'New') {
                    statusBadgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
                  } else if (inq.status === 'Resolved') {
                    statusBadgeClass = 'bg-gray-800 text-gray-300 border-gray-700';
                  }

                  return (
                    <tr key={inq.id} className="hover:bg-rajvi-charcoal/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-rajvi-offWhite">{inq.full_name}</div>
                        <div className="text-[11px] text-rajvi-muted">
                          {inq.company_name || inq.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">{inq.inquiry_type}</td>
                      <td className="py-3.5 px-6">
                        <span className="font-serif text-rajvi-goldLight">
                          {inq.diamond_name || 'General Inquiry'}
                        </span>
                        {inq.selected_size && (
                          <span className="block text-[10px] text-rajvi-muted">
                            Size: {inq.selected_size}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold border ${statusBadgeClass}`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-rajvi-muted text-[11px]">
                        {formatDate(inq.created_at)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <a
                          href={`/admin/inquiries?id=${inq.id}`}
                          className="inline-flex items-center gap-1 text-rajvi-gold hover:text-rajvi-goldLight font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-rajvi-muted">
            No inquiries recorded yet.
          </div>
        )}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <a
          href="/admin/diamonds"
          className="p-6 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Gem className="w-6 h-6 text-rajvi-gold mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base text-rajvi-offWhite font-normal mb-1">
            Manage Diamond Cuts
          </h4>
          <p className="text-xs text-rajvi-muted">
            Update specifications, images, active statuses, and millimeter calibrations.
          </p>
        </a>

        <a
          href="/admin/categories"
          className="p-6 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Layers className="w-6 h-6 text-rajvi-gold mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base text-rajvi-offWhite font-normal mb-1">
            Manage Categories
          </h4>
          <p className="text-xs text-rajvi-muted">
            Create and organize fancy cut categories and display orders.
          </p>
        </a>

        <a
          href="/admin/settings"
          className="p-6 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Sparkles className="w-6 h-6 text-rajvi-gold mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base text-rajvi-offWhite font-normal mb-1">
            Brand & Contact Settings
          </h4>
          <p className="text-xs text-rajvi-muted">
            Update WhatsApp number, address, hero slogans, and story details.
          </p>
        </a>
      </div>
    </div>
  );
}

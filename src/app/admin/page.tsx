import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
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
  TrendingUp,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
            Executive Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight sm:tracking-normal">
            Diamond Catalogue & Inquiries
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/diamonds/new"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-[13px] font-sans uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Diamond Cut</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        <StatsCard
          label="Active Diamond Cuts"
          value={stats.activeDiamonds}
          subValue={`${stats.inactiveDiamonds} disabled • ${stats.totalDiamonds} total recorded`}
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
          subValue={`${stats.newInquiries} New • ${stats.pendingInquiries || stats.newInquiries} Pending • ${stats.convertedInquiries} Converted`}
          icon={Inbox}
          badge={stats.newInquiries > 0 ? `${stats.newInquiries} New` : undefined}
        />
      </div>

      {/* Inquiry Demand Analytics & Monthly Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        {/* Most Requested Diamond Cuts */}
        <div className="lg:col-span-6 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-rajvi-borderDark/60">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-rajvi-gold" />
              <h3 className="font-serif text-lg text-rajvi-offWhite font-normal">
                Most Requested Diamond Cuts
              </h3>
            </div>
            <span className="text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/50">
              Demand Distribution
            </span>
          </div>

          {stats.mostRequestedCuts && stats.mostRequestedCuts.length > 0 ? (
            <div className="space-y-4">
              {stats.mostRequestedCuts.map((cut, idx) => (
                <div key={cut.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px] font-sans">
                    <span className="font-medium text-rajvi-offWhite flex items-center gap-2">
                      <span className="text-[11px] font-mono text-rajvi-gold/70">0{idx + 1}.</span>
                      {cut.name}
                    </span>
                    <span className="text-rajvi-offWhite/60 text-[12px]">
                      {cut.count} {cut.count === 1 ? 'inquiry' : 'inquiries'} ({cut.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#23211C] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rajvi-goldMuted to-rajvi-gold rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(cut.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[13px] text-rajvi-offWhite/50">
              No cut requests aggregated yet.
            </div>
          )}
        </div>

        {/* Monthly Inquiries Activity */}
        <div className="lg:col-span-6 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-rajvi-borderDark/60">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-rajvi-gold" />
              <h3 className="font-serif text-lg text-rajvi-offWhite font-normal">
                Monthly Inquiry Volume
              </h3>
            </div>
            <span className="text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/50">
              Past 6 Months
            </span>
          </div>

          {stats.monthlyInquiryStats && stats.monthlyInquiryStats.length > 0 ? (
            <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-[140px] pt-4">
              {stats.monthlyInquiryStats.map((item) => {
                const maxCount = Math.max(...stats.monthlyInquiryStats.map((s) => s.count), 1);
                const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 12);
                return (
                  <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono text-rajvi-gold font-semibold">
                      {item.count}
                    </span>
                    <div className="w-full max-w-[32px] bg-[#23211C] rounded-t-sm flex items-end h-[85px] overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-rajvi-gold/40 to-rajvi-gold rounded-t-sm transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-wider text-rajvi-offWhite/60 text-center truncate w-full">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-[13px] text-rajvi-offWhite/50">
              No monthly activity recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Inquiries Panel */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-rajvi-borderDark/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-rajvi-offWhite">
              Recent Trade Inquiries
            </h3>
            <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
              Latest client requests for parcels, dimensions, and manufacturing availability
            </p>
          </div>

          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-[13px] font-sans text-rajvi-gold hover:text-rajvi-goldLight font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {stats.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] font-sans">
              <thead className="bg-[#1F1E1A] text-rajvi-offWhite/70 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Client / Atelier</th>
                  <th className="py-3.5 px-6">Inquiry Type</th>
                  <th className="py-3.5 px-6">Cut of Interest</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Received</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/85">
                {stats.recentInquiries.map((inq) => {
                  let statusBadgeClass = 'bg-blue-950/40 text-blue-400 border-blue-800/40';
                  if (inq.status === 'New') {
                    statusBadgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
                  } else if (inq.status === 'Resolved' || inq.status === 'Converted') {
                    statusBadgeClass = 'bg-amber-950/40 text-amber-300 border-amber-800/40';
                  }

                  return (
                    <tr key={inq.id} className="hover:bg-rajvi-charcoal/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-rajvi-offWhite text-[14px]">{inq.full_name}</div>
                        <div className="text-[12px] text-rajvi-offWhite/60 mt-0.5">
                          {inq.company_name || inq.email}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-rajvi-offWhite/80">{inq.inquiry_type}</td>
                      <td className="py-4 px-6">
                        <span className="font-serif text-[15px] text-rajvi-goldLight">
                          {inq.diamond_name || 'General Inquiry'}
                        </span>
                        {inq.selected_size && (
                          <span className="block text-[11px] text-rajvi-offWhite/60 mt-0.5">
                            Size: {inq.selected_size}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold border ${statusBadgeClass}`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-rajvi-offWhite/60 text-[12px]">
                        {formatDate(inq.created_at)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/inquiries?id=${inq.id}`}
                          className="inline-flex items-center gap-1.5 text-rajvi-gold hover:text-rajvi-goldLight font-medium text-[13px]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[13px] text-rajvi-offWhite/60">
            No inquiries recorded yet.
          </div>
        )}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7">
        <Link
          href="/admin/diamonds"
          className="p-6 sm:p-7 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Gem className="w-6 h-6 text-rajvi-gold mb-3.5 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-lg text-rajvi-offWhite font-normal mb-1.5">
            Manage Diamond Cuts
          </h4>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 leading-relaxed">
            Update specifications, images, active statuses, and millimeter calibrations.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="p-6 sm:p-7 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Layers className="w-6 h-6 text-rajvi-gold mb-3.5 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-lg text-rajvi-offWhite font-normal mb-1.5">
            Manage Categories
          </h4>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 leading-relaxed">
            Create and organize fancy cut categories and display orders.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="p-6 sm:p-7 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm hover:border-rajvi-gold/40 transition-all group"
        >
          <Sparkles className="w-6 h-6 text-rajvi-gold mb-3.5 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-lg text-rajvi-offWhite font-normal mb-1.5">
            Brand & Contact Settings
          </h4>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 leading-relaxed">
            Update WhatsApp number, address, hero slogans, and story details.
          </p>
        </Link>
      </div>
    </div>
  );
}

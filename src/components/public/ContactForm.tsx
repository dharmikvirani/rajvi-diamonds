'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { InquiryFormData, validateInquiryForm } from '@/lib/validations';
import { generateWhatsAppUrl } from '@/lib/utils';

interface ContactFormProps {
  initialDiamondName?: string;
  initialSize?: string | null;
  initialColor?: string | null;
  initialClarity?: string | null;
  initialDiamondId?: string;
  inquiryTypeDefault?: string;
  whatsappNumber?: string;
  className?: string;
}

export default function ContactForm({
  initialDiamondName = '',
  initialSize = '',
  initialColor = '',
  initialClarity = '',
  initialDiamondId = '',
  inquiryTypeDefault = 'General Inquiry',
  whatsappNumber = '',
  className = '',
}: ContactFormProps) {
  const buildInitialMessage = (
    name?: string,
    size?: string | null,
    color?: string | null,
    clarity?: string | null
  ) => {
    if (!name) return '';
    const specs: string[] = [];
    if (size) specs.push(`Size: ${size}`);
    if (color) specs.push(`Color: ${color}`);
    if (clarity) specs.push(`Clarity: ${clarity}`);
    const specsSuffix = specs.length > 0 ? ` (${specs.join(', ')})` : '';
    return `Hello, I am interested in inquiring about the ${name}${specsSuffix} cut. Please provide availability and trade details.`;
  };

  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    inquiryType: inquiryTypeDefault,
    diamondName: initialDiamondName,
    selectedSize: initialSize || '',
    selectedColor: initialColor || '',
    selectedClarity: initialClarity || '',
    diamondId: initialDiamondId,
    message: buildInitialMessage(initialDiamondName, initialSize, initialColor, initialClarity),
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedSize: initialSize || '',
      selectedColor: initialColor || '',
      selectedClarity: initialClarity || '',
      message:
        prev.message === '' || prev.message.includes('Hello, I am interested in inquiring about')
          ? buildInitialMessage(initialDiamondName, initialSize, initialColor, initialClarity)
          : prev.message,
    }));
  }, [initialSize, initialDiamondName, initialColor, initialClarity]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const validation = validateInquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit inquiry. Please try again.');
      }

      setIsSuccess(true);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        inquiryType: 'General Inquiry',
        diamondName: '',
        selectedSize: '',
        selectedColor: '',
        selectedClarity: '',
        diamondId: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please connect via WhatsApp or email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const waUrl = generateWhatsAppUrl({
      phoneNumber: whatsappNumber,
      diamondName: initialDiamondName || formData.diamondName,
      selectedSize: initialSize || formData.selectedSize,
      color: initialColor || formData.selectedColor,
      clarity: initialClarity || formData.selectedClarity,
      customMessage: `Hello Rajvi Diamonds, I have submitted an inquiry for ${
        initialDiamondName || formData.diamondName || 'Fancy Diamond Cuts'
      }. Please share availability and trade details.`,
    });

    return (
      <div className={`bg-white border border-rajvi-borderLight rounded-sm p-8 text-center shadow-sm ${className}`}>
        <div className="w-16 h-16 rounded-full bg-[#EAF7EE] text-[#228B22] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl text-rajvi-textDark font-normal mb-2">
          Inquiry Successfully Received
        </h3>
        <p className="text-xs sm:text-sm text-rajvi-textMuted max-w-md mx-auto leading-relaxed mb-6">
          Thank you for reaching out to Rajvi Diamonds. Our lapidary specialists in Surat will review your requirements and respond promptly with detailed cut availability and specifications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Connect on WhatsApp as Well</span>
          </a>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full sm:w-auto px-6 py-3 bg-rajvi-gold text-rajvi-black text-xs uppercase tracking-widest font-semibold hover:bg-rajvi-goldLight transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white border border-rajvi-borderLight rounded-sm p-6 sm:p-8 shadow-sm space-y-6 ${className}`}
      noValidate
    >
      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Hidden honeypot field for bot detection */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Leave this empty</label>
        <input
          type="text"
          id="website_hp"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Active Selection Specifications Badge */}
      {(formData.diamondName || formData.selectedSize || formData.selectedColor || formData.selectedClarity) && (
        <div className="p-3.5 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-rajvi-gold font-bold">
              Specified Requirements:
            </span>
            {formData.diamondName && (
              <span className="px-2.5 py-1 bg-white border border-rajvi-borderLight text-rajvi-textDark font-medium rounded-sm text-[11px]">
                {formData.diamondName}
              </span>
            )}
            {formData.selectedSize && (
              <span className="px-2.5 py-1 bg-white border border-rajvi-borderLight text-rajvi-textDark font-medium rounded-sm text-[11px]">
                Size: {formData.selectedSize}
              </span>
            )}
            {formData.selectedColor && (
              <span className="px-2.5 py-1 bg-white border border-rajvi-borderLight text-rajvi-gold font-semibold rounded-sm text-[11px]">
                Color: {formData.selectedColor}
              </span>
            )}
            {formData.selectedClarity && (
              <span className="px-2.5 py-1 bg-white border border-rajvi-borderLight text-rajvi-gold font-semibold rounded-sm text-[11px]">
                Clarity: {formData.selectedClarity}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="e.g. John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold transition-colors ${
              errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-rajvi-borderLight'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-[11px] text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. client@atelier.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold transition-colors ${
              errors.email ? 'border-red-400 bg-red-50/20' : 'border-rajvi-borderLight'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Phone / WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="e.g. +1 555 123 4567 or +91 98201 12345"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold transition-colors ${
              errors.phone ? 'border-red-400 bg-red-50/20' : 'border-rajvi-borderLight'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Company / Atelier Name <span className="text-rajvi-textMuted text-[10px]">(Optional)</span>
          </label>
          <input
            type="text"
            name="companyName"
            placeholder="e.g. Atelier & Co."
            value={formData.companyName || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Inquiry Type */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Inquiry Type <span className="text-red-500">*</span>
          </label>
          <select
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-xs bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Wholesale Inquiry">Wholesale Inquiry</option>
            <option value="Jewellery Manufacturing Inquiry">Jewellery Manufacturing</option>
            <option value="Diamond Availability">Diamond Availability</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Diamond Name (Optional or Contextual) */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Diamond Cut <span className="text-rajvi-textMuted text-[10px]">(Optional)</span>
          </label>
          <input
            type="text"
            name="diamondName"
            placeholder="e.g. Rose Octagone"
            value={formData.diamondName || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          />
        </div>

        {/* Interested Size */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
            Interested Size <span className="text-rajvi-textMuted text-[10px]">(Optional)</span>
          </label>
          <input
            type="text"
            name="selectedSize"
            placeholder="e.g. 5 mm or Custom"
            value={formData.selectedSize || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-rajvi-textDark font-semibold mb-1.5">
          Inquiry Message & Requirements <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Please describe your specific cut requirements, quantities, or parcel timelines..."
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 text-xs bg-rajvi-offWhite border rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold transition-colors ${
            errors.message ? 'border-red-400 bg-red-50/20' : 'border-rajvi-borderLight'
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-[11px] text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-rajvi-black hover:bg-rajvi-charcoal text-rajvi-gold text-xs uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-rajvi-gold" />
              <span>Submit Secure Inquiry</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-rajvi-textMuted text-center">
        Your information is confidential and will be utilized solely to address your diamond inquiry.
      </p>
    </form>
  );
}

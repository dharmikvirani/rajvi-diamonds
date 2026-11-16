import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format diamond size in millimeters (e.g. "4.5 mm")
 */
export function formatSizeMm(size: number): string {
  // Check if integer or decimal
  const str = Number.isInteger(size) ? size.toFixed(0) : size.toFixed(1);
  return `${str} mm`;
}

/**
 * Generates WhatsApp click-to-chat URL with prefilled message
 */
export function generateWhatsAppUrl(options: {
  phoneNumber: string;
  diamondName?: string;
  selectedSize?: string | number | null;
  color?: string | null;
  clarity?: string | null;
  pageUrl?: string;
  customMessage?: string;
}): string {
  // Strip non-numeric characters except leading plus
  let cleanNumber = options.phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('00')) {
    cleanNumber = cleanNumber.substring(2);
  }

  let message = '';

  if (options.customMessage) {
    message = options.customMessage;
  } else if (options.diamondName) {
    const sizeStr = options.selectedSize
      ? typeof options.selectedSize === 'number'
        ? formatSizeMm(options.selectedSize)
        : options.selectedSize
      : null;

    const specs: string[] = [];
    if (sizeStr) specs.push(`Size: ${sizeStr}`);
    if (options.color) specs.push(`Color: ${options.color}`);
    if (options.clarity) specs.push(`Clarity: ${options.clarity}`);

    const specsSuffix = specs.length > 0 ? ` (${specs.join(', ')})` : '';

    message = `Hello Rajvi Diamonds, I am interested in inquiring about ${options.diamondName}${specsSuffix}. Please share availability and details.`;

    if (options.pageUrl) {
      message += `\nReference: ${options.pageUrl}`;
    }
  } else {
    message = `Hello Rajvi Diamonds, I am interested in exploring your fancy diamond cuts. Please connect with me.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Format ISO date for display
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

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
    if (options.selectedSize) {
      const sizeStr = typeof options.selectedSize === 'number'
        ? formatSizeMm(options.selectedSize)
        : options.selectedSize;
      message = `Hello Rajvi Diamonds, I am interested in ${options.diamondName} in ${sizeStr} size. Please share more details.`;
    } else {
      message = `Hello Rajvi Diamonds, I am interested in ${options.diamondName}. Please share availability and details.`;
    }

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

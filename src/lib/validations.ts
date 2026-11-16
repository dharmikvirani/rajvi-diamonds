export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  inquiryType: string;
  diamondId?: string;
  diamondName?: string;
  selectedSize?: string;
  message: string;
  honeypot?: string; // Bot protection
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateInquiryForm(data: Partial<InquiryFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // Honeypot check: If the hidden honeypot field is filled, silently mark invalid
  if (data.honeypot && data.honeypot.trim() !== '') {
    errors.honeypot = 'Automated submission detected.';
    return { isValid: false, errors };
  }

  // Full Name: required, min 2 chars
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters).';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters.';
  }

  // Email: required, valid RFC email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone Number: required, supports international format (+country code and 7-15 digits)
  const phoneClean = (data.phone || '').replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^\+?[0-9]{7,16}$/;
  if (!data.phone || !phoneRegex.test(phoneClean)) {
    errors.phone = 'Please provide a valid contact number with country code.';
  }

  // Inquiry Type: required
  const validTypes = [
    'General Inquiry',
    'Wholesale Inquiry',
    'Jewellery Manufacturing Inquiry',
    'Diamond Availability',
    'Other',
  ];
  if (!data.inquiryType || !validTypes.includes(data.inquiryType)) {
    errors.inquiryType = 'Please select a valid inquiry type.';
  }

  // Message: required, min 10 chars
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide details about your inquiry (minimum 10 characters).';
  } else if (data.message.trim().length > 2000) {
    errors.message = 'Message must not exceed 2000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// checkout-module/utils/formatters.ts

/**
 * Format currency amount with proper locale and currency code
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency 
  }).format(amount);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Format credit card number for display (with masking)
 */
export const formatCreditCardNumber = (cardNumber: string, mask: boolean = true): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (mask && cleaned.length > 4) {
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return `${masked}${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
  }
  
  // Format without masking
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Format address for display
 */
export const formatAddress = (address: {
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
}): string => {
  const parts = [
    address.address_1,
    address.address_2,
    `${address.city}, ${address.state} ${address.postcode}`,
    address.country && address.country !== 'US' ? address.country : null
  ].filter(Boolean);
  
  return parts.join('\n');
};

/**
 * Format subscription period for display
 */
export const formatSubscriptionPeriod = (
  period: string,
  interval: number = 1
): string => {
  const periodMap: Record<string, string> = {
    day: interval === 1 ? 'Daily' : `Every ${interval} days`,
    week: interval === 1 ? 'Weekly' : `Every ${interval} weeks`,
    month: interval === 1 ? 'Monthly' : `Every ${interval} months`,
    year: interval === 1 ? 'Yearly' : `Every ${interval} years`
  };
  
  return periodMap[period] || `Every ${interval} ${period}(s)`;
};

/**
 * Format date for display
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format order ID for display
 */
export const formatOrderId = (orderId: string | number): string => {
  return `#${orderId.toString().padStart(6, '0')}`;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Combined formatters object for easy import
 */
export const formatters = {
  currency: formatCurrency,
  phoneNumber: formatPhoneNumber,
  creditCard: formatCreditCardNumber,
  address: formatAddress,
  subscriptionPeriod: formatSubscriptionPeriod,
  date: formatDate,
  orderId: formatOrderId,
  fileSize: formatFileSize,
  truncateText: truncateText
};
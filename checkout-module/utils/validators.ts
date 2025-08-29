// checkout-module/utils/validators.ts

/**
 * Email validation using RFC 5322 compliant regex
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Phone number validation for international formats
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * US ZIP code validation (supports both 5-digit and 9-digit formats)
 */
export const validateZipCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip.trim());
};

/**
 * Required field validation
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Credit card number validation using Luhn algorithm
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleanNumber)) return false;
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * CVV validation
 */
export const validateCVV = (cvv: string, cardType?: string): boolean => {
  const cleanCVV = cvv.replace(/\s/g, '');
  
  // American Express uses 4-digit CVV
  if (cardType === 'amex') {
    return /^\d{4}$/.test(cleanCVV);
  }
  
  // Most other cards use 3-digit CVV
  return /^\d{3}$/.test(cleanCVV);
};

/**
 * Expiry date validation (MM/YY format)
 */
export const validateExpiryDate = (expiry: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
  if (!expiryRegex.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  // Check if the expiry date is in the future
  if (expYear > currentYear) return true;
  if (expYear === currentYear && expMonth >= currentMonth) return true;
  
  return false;
};

/**
 * Name validation (letters, spaces, hyphens, apostrophes only)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

/**
 * Address validation
 */
export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5;
};

/**
 * Combined validators object for easy import
 */
export const validators = {
  email: validateEmail,
  phone: validatePhone,
  zipCode: validateZipCode,
  required: validateRequired,
  creditCard: validateCreditCard,
  cvv: validateCVV,
  expiryDate: validateExpiryDate,
  name: validateName,
  address: validateAddress
};
// checkout-module/constants/index.ts

// ===================================
// VERSION INFO
// ===================================
export const VERSION = '2.0.0';

// ===================================
// US STATES
// ===================================
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
] as const;

// ===================================
// DEFAULT STYLES
// ===================================
export const DEFAULT_STYLES = {
  container: 'checkout-module max-w-6xl mx-auto p-4',
  form: 'space-y-8',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
  inputError: 'border-red-300',
  button: 'w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  buttonSecondary: 'w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors',
  error: 'text-red-500 text-sm mt-1',
  success: 'text-green-500 text-sm mt-1'
} as const;

// ===================================
// PAYMENT METHODS
// ===================================
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  COD: 'cod',
  PAYPAL: 'paypal'
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.STRIPE]: 'Credit Card (Stripe)',
  [PAYMENT_METHODS.COD]: 'Cash on Delivery',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal'
} as const;

// ===================================
// SUBSCRIPTION PERIODS
// ===================================
export const SUBSCRIPTION_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
} as const;

export const SUBSCRIPTION_PERIOD_LABELS = {
  [SUBSCRIPTION_PERIODS.DAY]: 'Daily',
  [SUBSCRIPTION_PERIODS.WEEK]: 'Weekly',
  [SUBSCRIPTION_PERIODS.MONTH]: 'Monthly',
  [SUBSCRIPTION_PERIODS.YEAR]: 'Yearly'
} as const;

// ===================================
// ORDER STATUSES
// ===================================
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  FAILED: 'failed'
} as const;

// ===================================
// CHECKOUT STEPS
// ===================================
export const CHECKOUT_STEPS = {
  FORM: 'form',
  PAYMENT: 'payment',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// ===================================
// API ENDPOINTS
// ===================================
export const API_ENDPOINTS = {
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  PRODUCTS: '/products',
  SUBSCRIPTIONS: '/subscriptions',
  PAYMENT_INTENT: '/wc-checkout/v1/payment/create-intent',
  CHECKOUT: '/wc-checkout/v1/checkout'
} as const;

// ===================================
// ERROR TYPES
// ===================================
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  ORDER_CREATION_ERROR: 'ORDER_CREATION_ERROR',
  SUBSCRIPTION_ERROR: 'SUBSCRIPTION_ERROR',
  WOOCOMMERCE_API_ERROR: 'WOOCOMMERCE_API_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// ===================================
// DEFAULT CONFIGURATION
// ===================================
export const DEFAULT_CONFIG = {
  currency: 'USD',
  taxRate: 0,
  version: 'v3',
  subscriptionsEnabled: false,
  appearance: {
    primaryColor: '#3B82F6',
    borderRadius: '8px',
    fontFamily: 'system-ui, sans-serif'
  }
} as const;

// ===================================
// VALIDATION REGEX PATTERNS
// ===================================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CREDIT_CARD: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/\d{2}$/,
  NAME: /^[a-zA-Z\s\-']+$/
} as const;

// ===================================
// STRIPE TEST CARDS
// ===================================
export const STRIPE_TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  REQUIRE_3DS: '4000000000003220',
  INSUFFICIENT_FUNDS: '4000000000009995',
  EXPIRED_CARD: '4000000000000069',
  INCORRECT_CVC: '4000000000000127'
} as const;

// ===================================
// COUNTRIES
// ===================================
export const COUNTRIES = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  AU: 'Australia'
} as const;

// ===================================
// TIMEOUTS
// ===================================
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  PAYMENT_PROCESSING: 60000, // 1 minute
  SUBSCRIPTION_SETUP: 45000 // 45 seconds
} as const;
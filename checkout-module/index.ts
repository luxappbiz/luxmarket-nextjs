// checkout-module/index.ts

// ===================================
// MAIN EXPORTS
// ===================================

// Core Components
export { CheckoutModule, SimpleCheckout } from './components/CheckoutModule';
export { CheckoutForm } from './components/CheckoutForm';
export { PaymentForm } from './components/PaymentForm';
export { StripePaymentForm } from './components/StripePaymentForm';
export { ProcessingState } from './components/ProcessingState';
export { SuccessState } from './components/SuccessState';
export { ErrorState } from './components/ErrorState';
export { OrderSummary } from './components/OrderSummary';

// Context and Hooks
export { CheckoutProvider, useCheckout } from './context/CheckoutProvider';

// API
export { CheckoutAPI } from './lib/checkout-api';

// Utilities
export { validators } from './utils/validators';
export { formatters } from './utils/formatters';

// Configuration
export { configPresets, exampleConfigs } from './config/presets';

// Constants
export { 
  VERSION, 
  US_STATES, 
  DEFAULT_STYLES, 
  PAYMENT_METHODS,
  CHECKOUT_STEPS,
  ERROR_TYPES 
} from './constants';

// Event System
export { CheckoutEventEmitter } from './utils/events';

// Types
export type {
  CheckoutConfig,
  CheckoutProduct,
  CheckoutUser,
  CheckoutFormData,
  CheckoutState,
  CheckoutCallbacks,
  CheckoutProps,
  BillingAddress,
  ShippingAddress,
  CheckoutItem,
  CheckoutOrderData,
  PaymentIntentData,
  CheckoutResponse,
  PaymentIntentResponse,
  WooCommerceOrder,
  WooCommerceCustomer,
  WooCommerceLineItem,
  SubscriptionData,
  SubscriptionResponse,
  OrderSummary as OrderSummaryType,
  CheckoutError,
  CheckoutErrorInfo,
  CheckoutEvents,
  WooCommerceCredentials,
  StripeConfig,
  WooCommerceSetupConfig
} from './types';

// ===================================
// MAIN CONFIGURATION FACTORY
// ===================================

import type { CheckoutConfig, WooCommerceSetupConfig } from './types';
import { DEFAULT_CONFIG, PAYMENT_METHODS } from './constants';

export function createCheckout(config: Partial<WooCommerceSetupConfig> = {}): CheckoutConfig {
  const {
    wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
    version = DEFAULT_CONFIG.version,
    stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    currency = DEFAULT_CONFIG.currency,
    taxRate = DEFAULT_CONFIG.taxRate,
    enabledPaymentMethods,
    subscriptionsEnabled = DEFAULT_CONFIG.subscriptionsEnabled
  } = config;

  if (!wordpressUrl) {
    throw new Error('WordPress URL is required');
  }

  const defaultPaymentMethods: ('stripe' | 'cod')[] = [];
  if (stripePublicKey) {
    defaultPaymentMethods.push(PAYMENT_METHODS.STRIPE as 'stripe');
  }
  defaultPaymentMethods.push(PAYMENT_METHODS.COD as 'cod');

  return {
    wordpressUrl: wordpressUrl.replace(/\/$/, ''),
    version,
    stripePublicKey,
    enabledPaymentMethods: enabledPaymentMethods || defaultPaymentMethods,
    currency,
    taxRate,
    subscriptionsEnabled,
    namespace: `wc/${version}`,
    appearance: DEFAULT_CONFIG.appearance
  };
}

// ===================================
// QUICK SETUP HELPER
// ===================================

export function quickSetup(
  wordpressUrl: string,
  options: Partial<{
    stripeKey?: string;
    taxRate?: number;
    subscriptions?: boolean;
  }> = {}
): CheckoutConfig {
  return createCheckout({
    wordpressUrl,
    stripePublicKey: options.stripeKey,
    taxRate: options.taxRate || 0.1,
    subscriptionsEnabled: options.subscriptions || false
  });
}

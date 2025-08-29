// checkout-module/config/presets.ts

import type { CheckoutConfig } from '../types';
import { DEFAULT_CONFIG, PAYMENT_METHODS } from '../constants';

// ===================================
// CONFIGURATION PRESET TYPES
// ===================================

interface BasicStoreCredentials {
  wordpressUrl: string;
  consumerKey: string;
  consumerSecret: string;
  stripeKey?: string;
}

interface SubscriptionStoreCredentials {
  wordpressUrl: string;
  consumerKey: string;
  consumerSecret: string;
  stripeKey: string;
}

// ===================================
// PRESET FACTORIES
// ===================================

/**
 * Creates a basic store configuration
 * Supports both Stripe and COD payments
 */
export const createBasicStoreConfig = (credentials: BasicStoreCredentials): CheckoutConfig => {
  const paymentMethods: ('stripe' | 'cod')[] = [];
  
  if (credentials.stripeKey) {
    paymentMethods.push(PAYMENT_METHODS.STRIPE as 'stripe');
  }
  paymentMethods.push(PAYMENT_METHODS.COD as 'cod');

  return {
    wordpressUrl: credentials.wordpressUrl.replace(/\/$/, ''),
    consumerKey: credentials.consumerKey,
    consumerSecret: credentials.consumerSecret,
    version: DEFAULT_CONFIG.version,
    stripePublicKey: credentials.stripeKey,
    enabledPaymentMethods: paymentMethods,
    subscriptionsEnabled: DEFAULT_CONFIG.subscriptionsEnabled,
    currency: DEFAULT_CONFIG.currency,
    taxRate: DEFAULT_CONFIG.taxRate,
    namespace: `wc/${DEFAULT_CONFIG.version}`,
    appearance: DEFAULT_CONFIG.appearance
  };
};

/**
 * Creates a subscription-enabled store configuration
 * Requires Stripe for recurring payments
 */
export const createSubscriptionStoreConfig = (credentials: SubscriptionStoreCredentials): CheckoutConfig => {
  return {
    wordpressUrl: credentials.wordpressUrl.replace(/\/$/, ''),
    consumerKey: credentials.consumerKey,
    consumerSecret: credentials.consumerSecret,
    version: DEFAULT_CONFIG.version,
    stripePublicKey: credentials.stripeKey,
    enabledPaymentMethods: [PAYMENT_METHODS.STRIPE as 'stripe', PAYMENT_METHODS.COD as 'cod'],
    subscriptionsEnabled: true,
    currency: DEFAULT_CONFIG.currency,
    taxRate: DEFAULT_CONFIG.taxRate,
    namespace: `wc/${DEFAULT_CONFIG.version}`,
    appearance: DEFAULT_CONFIG.appearance
  };
};

/**
 * Creates a minimal COD-only store configuration
 */
export const createMinimalStoreConfig = (credentials: Omit<BasicStoreCredentials, 'stripeKey'>): CheckoutConfig => {
  return {
    wordpressUrl: credentials.wordpressUrl.replace(/\/$/, ''),
    consumerKey: credentials.consumerKey,
    consumerSecret: credentials.consumerSecret,
    version: DEFAULT_CONFIG.version,
    enabledPaymentMethods: [PAYMENT_METHODS.COD as 'cod'],
    subscriptionsEnabled: DEFAULT_CONFIG.subscriptionsEnabled,
    currency: DEFAULT_CONFIG.currency,
    taxRate: DEFAULT_CONFIG.taxRate,
    namespace: `wc/${DEFAULT_CONFIG.version}`,
    appearance: DEFAULT_CONFIG.appearance
  };
};

// ===================================
// PRESET CONFIGURATIONS
// ===================================

export const configPresets = {
  basicStore: createBasicStoreConfig,
  subscriptionStore: createSubscriptionStoreConfig,
  minimalStore: createMinimalStoreConfig
};

// ===================================
// EXAMPLE CONFIGURATIONS
// ===================================

export const exampleConfigs = {
  development: {
    wordpressUrl: 'http://localhost:8000',
    consumerKey: 'ck_your_consumer_key_here',
    consumerSecret: 'cs_your_consumer_secret_here',
    stripePublicKey: 'pk_test_...',
    enabledPaymentMethods: ['stripe', 'cod'] as const,
    currency: 'USD',
    taxRate: 0.08,
    version: 'v3' as const
  },
  
  production: {
    wordpressUrl: 'https://your-site.com',
    consumerKey: 'ck_your_live_consumer_key',
    consumerSecret: 'cs_your_live_consumer_secret',
    stripePublicKey: 'pk_live_...',
    enabledPaymentMethods: ['stripe', 'cod'] as const,
    currency: 'USD',
    taxRate: 0.1,
    version: 'v3' as const
  },
  
  minimal: {
    wordpressUrl: 'https://your-site.com',
    consumerKey: 'ck_your_consumer_key',
    consumerSecret: 'cs_your_consumer_secret',
    enabledPaymentMethods: ['cod'] as const,
    currency: 'USD',
    taxRate: 0,
    version: 'v3' as const
  }
} as const;
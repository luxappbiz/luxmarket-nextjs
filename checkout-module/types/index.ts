// checkout-module/types/index.ts

// ===================================
// CONFIGURATION TYPES
// ===================================

export interface WooCommerceSetupConfig {
  wordpressUrl: string;
  consumerKey: string;
  consumerSecret: string;
  version?: "v3" | "v2" | "v1";
  stripePublicKey?: string;
  currency?: string;
  taxRate?: number;
  enabledPaymentMethods?: ("stripe" | "cod")[];
  subscriptionsEnabled?: boolean;
}

export interface CheckoutConfig {
  wordpressUrl: string;
  consumerKey: string;
  consumerSecret: string;
  stripePublicKey?: string;
  enabledPaymentMethods?: ("stripe" | "cod")[];
  namespace?: string;
  version?: "v3" | "v2" | "v1";
  currency?: string;
  taxRate?: number;
  subscriptionsEnabled?: boolean;
  trialPeriodEnabled?: boolean;
  appearance?: {
    primaryColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
}

export interface WooCommerceCredentials {
  consumerKey: string;
  consumerSecret: string;
  wordpressUrl: string;
  version?: "v3" | "v2" | "v1";
}

export interface StripeConfig {
  publishableKey: string;
  webhookSecret?: string;
  apiVersion?: string;
}

// ===================================
// PRODUCT TYPES
// ===================================

export interface CheckoutProduct {
  id: number | string;
  variation_id?: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // Subscription specific fields
  is_subscription?: boolean;
  subscription_period?: "day" | "week" | "month" | "year";
  subscription_interval?: number;
  subscription_length?: number;
  trial_period?: number;
  trial_length?: number;
}

// ===================================
// USER TYPES
// ===================================

export interface CheckoutUser {
  id?: number | string;
  email?: string;
  user_email?: string; 
  first_name?: string;
  last_name?: string;
  token?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

// ===================================
// FORM DATA TYPES
// ===================================

export interface CheckoutFormData {
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
  payment_method?: "stripe" | "cod";
  // Shipping fields
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  same_as_billing?: boolean;
  // Subscription fields
  subscription_terms_accepted?: boolean;
  password?: string;
}

// ===================================
// STATE TYPES
// ===================================

export interface CheckoutState {
  step: "form" | "payment" | "processing" | "success" | "error";
  isLoading: boolean;
  error: string | null;
  formData: Partial<CheckoutFormData>;
  products: CheckoutProduct[];
  user: CheckoutUser | null;
  paymentData: {
    stripeClientSecret?: string;
    amount: number;
    currency: string;
  };
  orderResult: {
    orderId?: string;
    orderKey?: string;
    total?: string;
    paymentMethod?: string;
    // Subscription specific
    subscriptionId?: string;
    nextPaymentDate?: string;
    billingPeriod?: string;
  } | null;
}

// ===================================
// CALLBACK TYPES
// ===================================

export interface CheckoutCallbacks {
  onSuccess?: (result: {
    orderId: string;
    orderKey: string;
    total: string;
    paymentMethod: string;
    subscriptionId?: string;
    nextPaymentDate?: string;
  }) => void;
  onError?: (error: string) => void;
  onStepChange?: (step: CheckoutState["step"]) => void;
  onFormDataChange?: (data: Partial<CheckoutFormData>) => void;
  onSubscriptionCreated?: (subscription: SubscriptionResponse) => void;
}

// ===================================
// COMPONENT PROPS TYPES
// ===================================

export interface CheckoutProps {
  products: CheckoutProduct[];
  user?: CheckoutUser | null;
  config: CheckoutConfig;
  callbacks?: CheckoutCallbacks;
  className?: string;
  subscriptionMode?: boolean;
}

export interface CheckoutProviderProps {
  children: React.ReactNode;
  config: CheckoutConfig;
  callbacks?: CheckoutCallbacks;
}

export interface CheckoutContextType {
  // State
  state: CheckoutState;
  config: CheckoutConfig;

  // Actions
  setProducts: (products: CheckoutProduct[]) => void;
  setUser: (user: CheckoutUser | null) => void;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setStep: (step: CheckoutState["step"]) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Main checkout functions
  submitOrder: () => Promise<void>;
  processStripePayment: (clientSecret: string) => Promise<void>;
  processCODPayment: () => Promise<void>;

  // Utilities
  calculateTotals: () => {
    subtotal: number;
    tax: number;
    total: number;
    taxRate: number;
  };
  resetCheckout: () => void;

  // Subscription helpers
  isSubscriptionOrder: () => boolean;
  requiresLogin: () => boolean;
}

// ===================================
// ADDRESS TYPES
// ===================================

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

// ===================================
// ORDER TYPES
// ===================================

export interface CheckoutItem {
  product_id: number | string;
  variation_id?: number | string;
  quantity: number;
  // Subscription specific
  subscription_period?: "day" | "week" | "month" | "year";
  subscription_interval?: number;
}

export interface CheckoutOrderData {
  billing: BillingAddress;
  shipping?: ShippingAddress;
  line_items: CheckoutItem[];
  payment_method: "stripe" | "cod" | "paypal";
  customer_id?: number | string;
  customer_token?: string;
  set_paid?: boolean;
  transaction_id?: string;
  payment_method_title?: string;
  status?: string;
  customer_note?: string;
  meta_data?: Array<{
    key: string;
    value: string | number | boolean | null;
  }>;
}

export interface CheckoutResponse {
  success: boolean;
  order?: {
    id: number | string;
    order_key: string;
    status: string;
    total: string;
    currency: string;
    payment_method: string;
    payment_method_title: string;
    customer_id?: number;
    transaction_id?: string;
  };
  message?: string;
  error?: string;
}

// ===================================
// PAYMENT TYPES
// ===================================

export interface PaymentIntentData {
  amount: number; // in cents
  currency?: string;
  customer_id?: string;
  metadata?: Record<string, string | number | boolean>;
  setup_future_usage?: "off_session" | "on_session";
  subscription_data?: {
    trial_period_days?: number;
  };
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  amount?: number;
  currency?: string;
  id?: string;
  customer?: string;
  subscription?: string;
  message?: string;
  error?: string;
}

// ===================================
// SUBSCRIPTION TYPES
// ===================================

export interface SubscriptionData {
  billing: BillingAddress;
  shipping?: ShippingAddress;
  line_items: CheckoutItem[];
  payment_method: "stripe" | "cod";
  customer_id?: number | string;
  transaction_id?: string;
  billing_period?: "day" | "week" | "month" | "year";
  billing_interval?: number;
  trial_period?: "day" | "week" | "month" | "year";
  trial_length?: number;
  subscription_length?: number;
  password?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: {
    id: string;
    order_key: string;
    status: string;
    total: string;
    currency: string;
    payment_method: string;
    billing_period?: string;
    billing_interval?: number;
    next_payment_date?: string;
    trial_end_date?: string;
  };
  error?: string;
}

// ===================================
// WOOCOMMERCE TYPES
// ===================================

export interface WooCommerceMetaData {
  id: number;
  key: string;
  value: string | number | boolean | object | null;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string | null;
  cart_hash: string;
  number: string;
  meta_data: WooCommerceMetaData[];
  line_items: WooCommerceLineItem[];
  tax_lines: WooCommerceTaxLine[];
  shipping_lines: WooCommerceShippingLine[];
  fee_lines: WooCommerceFee[];
  coupon_lines: WooCommerceCoupon[];
  refunds: WooCommerceRefund[];
}

export interface WooCommerceLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: WooCommerceTax[];
  meta_data: WooCommerceMetaData[];
  sku: string;
  price: number;
}

export interface WooCommerceTax {
  id: number;
  total: string;
  subtotal: string;
}

export interface WooCommerceTaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  meta_data: WooCommerceMetaData[];
}

export interface WooCommerceShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  total: string;
  total_tax: string;
  taxes: WooCommerceTax[];
  meta_data: WooCommerceMetaData[];
}

export interface WooCommerceFee {
  id: number;
  name: string;
  tax_class: string;
  tax_status: string;
  total: string;
  total_tax: string;
  taxes: WooCommerceTax[];
  meta_data: WooCommerceMetaData[];
}

export interface WooCommerceCoupon {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: WooCommerceMetaData[];
}

export interface WooCommerceRefund {
  id: number;
  reason: string;
  total: string;
}

export interface WooCommerceCustomer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: WooCommerceMetaData[];
}

export interface WooCommerceWebhook {
  id: number;
  name: string;
  status: "active" | "paused" | "disabled";
  topic: string;
  resource: string;
  event: string;
  hooks: string[];
  delivery_url: string;
  secret: string;
  date_created: string;
  date_modified: string;
}

// ===================================
// ERROR TYPES
// ===================================

export type CheckoutError =
  | "VALIDATION_ERROR"
  | "PAYMENT_ERROR"
  | "NETWORK_ERROR"
  | "ORDER_CREATION_ERROR"
  | "SUBSCRIPTION_ERROR"
  | "WOOCOMMERCE_API_ERROR"
  | "AUTHENTICATION_ERROR"
  | "UNKNOWN_ERROR";

export interface CheckoutErrorInfo {
  type: CheckoutError;
  message: string;
  field?: string;
  code?: string;
  details?: string | number | boolean | object | null;
}

// ===================================
// EVENT TYPES
// ===================================

export interface CheckoutEvents {
  "form:submit": CheckoutFormData;
  "payment:start": { method: string; amount: number };
  "payment:success": { transactionId: string; amount: number };
  "payment:error": { error: string; method: string };
  "order:created": { orderId: string; total: string };
  "subscription:created": { subscriptionId: string; nextPayment: string };
  "step:change": { from: string; to: string };
}

// ===================================
// SUMMARY TYPES
// ===================================

export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  items: CheckoutProduct[];
}

// ===================================
// REDUCER TYPES
// ===================================

export type CheckoutAction =
  | { type: "SET_PRODUCTS"; payload: CheckoutProduct[] }
  | { type: "SET_USER"; payload: CheckoutUser | null }
  | { type: "UPDATE_FORM_DATA"; payload: Partial<CheckoutFormData> }
  | { type: "SET_STEP"; payload: CheckoutState["step"] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PAYMENT_DATA"; payload: Partial<CheckoutState["paymentData"]> }
  | { type: "SET_ORDER_RESULT"; payload: CheckoutState["orderResult"] }
  | { type: "RESET_CHECKOUT" };

// checkout-module/lib/checkout-api.ts

import axios, { AxiosInstance } from "axios";
import {
  CheckoutConfig,
  CheckoutOrderData,
  PaymentIntentData,
  CheckoutResponse,
  PaymentIntentResponse,
  WooCommerceCustomer,
  SubscriptionData,
  SubscriptionResponse,
} from "../types";
import { TIMEOUTS, API_ENDPOINTS, PAYMENT_METHOD_LABELS } from "../constants";

// Define interfaces for the API data structures
interface LineItem {
  product_id: number | string;
  variation_id?: number | string;
  quantity: number;
  subscription_period?: string;
  subscription_interval?: number;
}

interface WooOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: unknown;
  shipping?: unknown;
  customer_id: number;
  transaction_id?: string;
  status: string;
  subscription_line_items?: Array<{
    product_id: number;
    variation_id?: number;
    quantity: number;
    duration: string;
  }>;
  line_items?: Array<{
    product_id: number;
    variation_id?: number;
    quantity: number;
  }>;
  meta_data?: Array<{
    key: string;
    value: unknown;
  }>;
}

interface SubscriptionAPIData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: unknown;
  shipping?: unknown;
  subscription_line_items: Array<{
    product_id: number;
    quantity: number;
    duration: string;
  }>;
  customer_id: number;
  status: string;
}

interface PaymentIntentAPIData {
  amount: number;
  currency?: string;
  customer_id?: string;
  metadata?: Record<string, unknown>;
  setup_future_usage?: string;
  customer_token?: unknown;
  subscription_enabled?: unknown;
}

export class CheckoutAPI {
  private client: AxiosInstance;
  private config: CheckoutConfig;
  private userToken?: string;

  constructor(config: CheckoutConfig) {
    this.config = config;
    this.client = this.createHttpClient();
    this.setupInterceptors();
  }

  // ===================================
  // INITIALIZATION METHODS
  // ===================================

  private createHttpClient(): AxiosInstance {
    const version = this.config.version || "v3";

    return axios.create({
      baseURL: `/api/commerce/wc/${version}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: TIMEOUTS.API_REQUEST,
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.userToken) {
          config.headers["X-Customer-Token"] = this.userToken;
        }
        return config;
      },
      (error) => {
        console.error("🛒 WooCommerce API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "🛒 WooCommerce API Error:",
          error.response?.status,
          error.config?.url
        );

        if (error.response) {
          const message =
            error.response.data?.message ||
            `WooCommerce API error: ${error.response.status}`;
          throw new Error(message);
        } else if (error.request) {
          throw new Error("Network error: Unable to reach WooCommerce API");
        } else {
          throw new Error("Request failed: " + error.message);
        }
      }
    );
  }

  // ===================================
  // AUTHENTICATION METHODS
  // ===================================

  /**
   * Set authentication token for logged-in users
   */
  setAuthToken(token: string): void {
    this.userToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.userToken = undefined;
  }

  // ===================================
  // ORDER MANAGEMENT
  // ===================================

  /**
   * Create WooCommerce order with subscription support
   */
  async createOrder(orderData: CheckoutOrderData): Promise<CheckoutResponse> {
    try {
      const hasSubscriptionItems = this.hasSubscriptionItems(
        orderData.line_items
      );
      const wooOrderData = this.buildOrderData(orderData, hasSubscriptionItems);

      const endpoint =
        hasSubscriptionItems && this.config.subscriptionsEnabled
          ? API_ENDPOINTS.SUBSCRIPTIONS
          : API_ENDPOINTS.ORDERS;

      const response = await this.client.post(endpoint, wooOrderData);

      return {
        success: true,
        order: {
          id: response.data.id,
          order_key: response.data.order_key,
          status: response.data.status,
          total: response.data.total,
          currency: response.data.currency,
          payment_method: response.data.payment_method,
          payment_method_title: response.data.payment_method_title,
        },
      };
    } catch (error) {
      console.error("Order creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Order creation failed",
      };
    }
  }

  /**
   * Create subscription using custom endpoint
   */
  async createSubscription(
    subscriptionData: SubscriptionData
  ): Promise<SubscriptionResponse> {
    try {
      const customClient = this.createCustomClient();
      const checkoutData = this.buildSubscriptionData(subscriptionData);

      const response = await customClient.post(
        API_ENDPOINTS.CHECKOUT,
        checkoutData
      );

      if (response.data.success) {
        return {
          success: true,
          subscription: {
            id: response.data.order_id || response.data.subscription_id,
            order_key: response.data.order_key || "",
            status: response.data.status || "pending",
            total: response.data.total || "0",
            currency: response.data.currency || "USD",
            payment_method:
              response.data.payment_method || subscriptionData.payment_method,
            billing_period: subscriptionData.billing_period,
            billing_interval: subscriptionData.billing_interval,
            next_payment_date: this.calculateNextPayment(
              subscriptionData.billing_period,
              subscriptionData.billing_interval
            ),
          },
        };
      } else {
        throw new Error(
          response.data.message || "Subscription creation failed"
        );
      }
    } catch (error) {
      console.error("Subscription creation error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Subscription creation failed",
      };
    }
  }

  // ===================================
  // PAYMENT METHODS
  // ===================================

  /**
   * Create Stripe payment intent with subscription support
   */
  async createStripePaymentIntent(
    data: PaymentIntentData
  ): Promise<PaymentIntentResponse> {
    try {
      const customClient = this.createCustomClient();
      const paymentData = this.buildPaymentIntentData(data);

      const response = await customClient.post(
        API_ENDPOINTS.PAYMENT_INTENT,
        paymentData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment intent creation failed",
      };
    }
  }

  // ===================================
  // CUSTOMER MANAGEMENT
  // ===================================

  /**
   * Get customer data
   */
  async getCustomer(customerId?: number | string): Promise<{
    success: boolean;
    customer?: WooCommerceCustomer;
    error?: string;
  }> {
    try {
      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      const response = await this.client.get(
        `${API_ENDPOINTS.CUSTOMERS}/${customerId}`
      );

      return {
        success: true,
        customer: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get customer data",
      };
    }
  }

  // ===================================
  // PRIVATE HELPER METHODS
  // ===================================

  private createCustomClient(): AxiosInstance {
    const client = axios.create({
      baseURL: `/api/commerce`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: TIMEOUTS.API_REQUEST,
    });

    client.interceptors.request.use((config) => {
      if (this.userToken) {
        config.headers["X-Customer-Token"] = this.userToken;
      }

      return config;
    });

    return client;
  }

  private hasSubscriptionItems(lineItems: LineItem[]): boolean {
    return lineItems.some(
      (item) => item.subscription_period && item.subscription_interval
    );
  }

  private buildOrderData(
    orderData: CheckoutOrderData,
    hasSubscriptionItems: boolean
  ): WooOrderData {
    const wooOrderData: WooOrderData = {
      payment_method: orderData.payment_method,
      payment_method_title: this.getPaymentMethodTitle(
        orderData.payment_method
      ),
      set_paid: orderData.set_paid || false,
      billing: orderData.billing,
      shipping: orderData.shipping || orderData.billing,
      customer_id: orderData.customer_id ? Number(orderData.customer_id) : 0,
      transaction_id: orderData.transaction_id,
      status: orderData.set_paid ? "processing" : "pending",
    };

    if (hasSubscriptionItems) {
      wooOrderData.subscription_line_items = orderData.line_items.map(
        (item) => ({
          product_id: Number(item.product_id),
          variation_id: item.variation_id
            ? Number(item.variation_id)
            : undefined,
          quantity: item.quantity,
          duration:
            item.subscription_period === "month"
              ? "monthly"
              : item.subscription_period === "year"
              ? "yearly"
              : "monthly",
        })
      );

      wooOrderData.meta_data = [
        ...(orderData.meta_data || []),
        {
          key: "_subscription_period",
          value: orderData.line_items[0].subscription_period || "month",
        },
        {
          key: "_subscription_interval",
          value: orderData.line_items[0].subscription_interval || 1,
        },
      ];
    } else {
      wooOrderData.line_items = orderData.line_items.map((item) => ({
        product_id: Number(item.product_id),
        variation_id: item.variation_id ? Number(item.variation_id) : undefined,
        quantity: item.quantity,
      }));
    }

    return wooOrderData;
  }

  private buildSubscriptionData(
    subscriptionData: SubscriptionData
  ): SubscriptionAPIData {
    return {
      payment_method: subscriptionData.payment_method,
      payment_method_title: this.getPaymentMethodTitle(
        subscriptionData.payment_method
      ),
      set_paid: false,
      billing: subscriptionData.billing,
      shipping: subscriptionData.shipping || subscriptionData.billing,
      subscription_line_items: subscriptionData.line_items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: item.quantity,
        duration:
          item.subscription_period === "month"
            ? "monthly"
            : item.subscription_period === "year"
            ? "yearly"
            : "monthly",
      })),
      customer_id: subscriptionData.customer_id
        ? Number(subscriptionData.customer_id)
        : 1,
      status: "pending",
      ...(subscriptionData.password ? { password: subscriptionData.password } : {}),
    };
  }

  private buildPaymentIntentData(
    data: PaymentIntentData
  ): PaymentIntentAPIData {
    return {
      ...data,
      setup_future_usage: data.setup_future_usage || "off_session",
      metadata: {
        ...data.metadata,
        customer_token: this.userToken,
        subscription_enabled: this.config.subscriptionsEnabled,
      },
    };
  }

  private getPaymentMethodTitle(method: string): string {
    return (
      PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS] ||
      method.charAt(0).toUpperCase() + method.slice(1)
    );
  }

  private calculateNextPayment(
    period: string = "month",
    interval: number = 1
  ): string {
    const now = new Date();

    switch (period) {
      case "day":
        now.setDate(now.getDate() + interval);
        break;
      case "week":
        now.setDate(now.getDate() + interval * 7);
        break;
      case "month":
        now.setMonth(now.getMonth() + interval);
        break;
      case "year":
        now.setFullYear(now.getFullYear() + interval);
        break;
    }

    return now.toISOString().split("T")[0];
  }
}

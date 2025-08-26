'use client';

import { useSearchParams } from 'next/navigation';
import { CheckoutModule } from '@/checkout-module';
import type { CheckoutConfig, CheckoutProduct } from '@/checkout-module';

// Your checkout configuration
const checkoutConfig: CheckoutConfig = {
  wordpressUrl: process.env.NEXT_PUBLIC_BASE_API_URL || '',
  consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '',
  consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  enabledPaymentMethods: ['stripe'],
  subscriptionsEnabled: true,
  currency: 'USD',
  taxRate: 0.0,  
  version: 'v3'
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  
  // Extract plan details from URL params
  const planId = searchParams.get('planId');
  const productId = searchParams.get('productId');
  const price = searchParams.get('price');
  const period = searchParams.get('period');
  const interval = searchParams.get('interval');

  if (!planId || !productId || !price || !period || !interval) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan Selection</h1>
          <p className="text-muted-foreground mb-4">
            Please select a plan from the membership page.
          </p>
          <a 
            href="/membership" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go to Membership
          </a>
        </div>
      </div>
    );
  }

  // Build checkout product
  const checkoutProducts: CheckoutProduct[] = [
    {
      id: parseInt(productId),
      name: planId === 'monthly-plan' ? 'Monthly Plan' : 'Annual Plan',
      price: parseFloat(price),
      quantity: 1,
      is_subscription: true,
      subscription_period: period as 'month' | 'year',
      subscription_interval: parseInt(interval)
    }
  ];

  const handleCheckoutSuccess = (result: any) => {
    console.log('Checkout successful:', result);
    // You can redirect to success page or show confirmation
  };

  const handleCheckoutError = (error: string) => {
    console.error('Checkout error:', error);
    // Handle error - show toast, etc.
  };

  return (
    <div className="min-h-screen bg-background">
      <CheckoutModule
        products={checkoutProducts}
        config={checkoutConfig}
        callbacks={{
          onSuccess: handleCheckoutSuccess,
          onError: handleCheckoutError
        }}
      />
    </div>
  );
}
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckoutModule } from '@/checkout-module';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { CheckoutConfig, CheckoutProduct } from '@/checkout-module';

const checkoutConfig: CheckoutConfig = {
  wordpressUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mkdistributionllc.com',
  consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY || '',
  consumerSecret: process.env.NEXT_PUBLIC_CONSUMER_SECRET || '',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  enabledPaymentMethods: ['stripe'],
  subscriptionsEnabled: true,
  currency: 'USD',
  taxRate: 0.0,
  version: 'v3'
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = searchParams.get('planId');
  const productId = searchParams.get('productId');
  const variationId = searchParams.get('variationId');
  const price = searchParams.get('price');
  const period = searchParams.get('period');
  const interval = searchParams.get('interval');
  const planName = searchParams.get('planName') || 'Subscription Plan';

  if (!productId || !variationId || !price || !period || !interval) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan Selection</h1>
          <p className="text-muted-foreground mb-4">
            Please select a plan from the membership page.
          </p>
          <Button onClick={() => router.push('/membership')}>
            Go to Membership
          </Button>
        </div>
      </div>
    );
  }

  const checkoutProducts: CheckoutProduct[] = [
    {
      id: parseInt(productId),
      variation_id: parseInt(variationId),
      name: planName,
      price: parseFloat(price),
      quantity: 1,
      is_subscription: true,
      subscription_period: period as 'month' | 'year',
      subscription_interval: parseInt(interval)
    }
  ];

  const handleCheckoutSuccess = (result: any) => {
    console.log('Checkout successful:', result);
    
    if (result.subscriptionId) {
      toast.success('Subscription created successfully!');
      
      // Store subscription info
      localStorage.setItem('activeSubscription', JSON.stringify({
        subscriptionId: result.subscriptionId,
        orderId: result.orderId,
        planName: planName,
        period: period,
        nextPayment: result.nextPaymentDate
      }));
      
      router.push('/account');
    } else {
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    }
  };

  const handleCheckoutError = (error: string) => {
    console.error('Checkout error:', error);
    toast.error(error || 'Checkout failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/membership')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your {planName} subscription
          </p>
        </div>

        <CheckoutModule
          products={checkoutProducts}
          config={checkoutConfig}
          callbacks={{
            onSuccess: handleCheckoutSuccess,
            onError: handleCheckoutError
          }}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'monthly-plan',
    productId: 123,  
    name: 'Monthly Plan',
    description: 'Perfect for getting started',
    price: 99,
    period: 'month',
    interval: 1,
    billing: 'Billed monthly',
    features: [
      'Full access to all features',
      '24/7 customer support',
      'Cancel anytime',
      'Monthly billing cycle'
    ]
  },
  {
    id: 'annual-plan',
    productId: 124, 
    name: 'Annual Plan',
    description: 'Best value - save $189/year',
    price: 999,
    period: 'year',
    interval: 1,
    billing: 'Billed annually',
    popular: true,
    features: [
      'Full access to all features',
      '24/7 priority support',
      'Cancel anytime',
      'Annual billing cycle',
      'Save $189 compared to monthly'
    ]
  }
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('annual-plan');
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToCheckout = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      const params = new URLSearchParams({
        planId: plan.id,
        productId: plan.productId.toString(),
        price: plan.price.toString(),
        period: plan.period,
        interval: plan.interval.toString()
      });
      
      router.push(`/checkout?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-4">{plan.description}</CardDescription>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period === 'month' ? 'mo' : 'year'}</span>
                </div>
                
                <p className="text-sm text-muted-foreground">{plan.billing}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={handleProceedToCheckout}
            size="lg" 
            className="px-8"
          >
            Continue to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
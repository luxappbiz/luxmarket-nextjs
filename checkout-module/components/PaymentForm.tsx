// checkout-module/components/PaymentForm.tsx
'use client';

import React from 'react';
import { useCheckout } from '../context/CheckoutProvider';
import { StripePaymentForm } from './StripePaymentForm';

export function PaymentForm() {
    const { state } = useCheckout();
    console.log('PaymentForm state:', state);
    const renderPaymentMethod = () => {
        if (state.formData.payment_method === 'stripe' && state.paymentData.stripeClientSecret) {
            return (
                <StripePaymentForm
                    clientSecret={state.paymentData.stripeClientSecret}
                    amount={state.paymentData.amount}
                />
            );
        }

        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No payment method selected</p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                <p className="text-gray-600">
                    Securely complete your payment to finish your order
                </p>
            </div>

            {state.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {state.error}
                    </p>
                </div>
            )}

            {renderPaymentMethod()}
        </div>
    );
}
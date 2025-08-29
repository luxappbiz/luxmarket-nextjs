// checkout-module/components/ErrorState.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../context/CheckoutProvider';

export function ErrorState() {
    const { state, setStep, setError } = useCheckout();
    const router = useRouter();

    const handleRetry = () => {
        setError(null);
        setStep('form');
    };

    const handleBackToProducts = () => {
        router.back();
    };

    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Failed</h1>

            <p className="text-gray-600 mb-6">
                {state.error || 'Something went wrong while processing your order. Please try again.'}
            </p>

            <div className="space-y-3 max-w-md mx-auto">
                <button
                    onClick={handleRetry}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>

                <button
                    onClick={handleBackToProducts}
                    className="w-full text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Back to Products
                </button>
            </div>
        </div>
    );
}

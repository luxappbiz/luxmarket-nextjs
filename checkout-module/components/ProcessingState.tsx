// checkout-module/components/ProcessingState.tsx
'use client';

import React from 'react';
// import { useCheckout } from '../context/CheckoutProvider';

export function ProcessingState() {
    // const { state } = useCheckout();

    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h1>
            <p className="text-gray-600">
                Please wait while we process your payment and create your order...
            </p>
        </div>
    );
}
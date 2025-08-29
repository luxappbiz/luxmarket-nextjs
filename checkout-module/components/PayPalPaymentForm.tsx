// checkout-module/components/PayPalPaymentForm.tsx
'use client';

import React, { useState } from 'react';
import { useCheckout } from '../context/CheckoutProvider';

interface PayPalPaymentFormProps {
    amount: number;
}

export function PayPalPaymentForm({ amount }: PayPalPaymentFormProps) {
    const { submitOrder, setError, setStep } = useCheckout();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayPalPayment = async () => {
        setIsProcessing(true);
        try {
            await submitOrder(); // This will handle PayPal redirect
        } catch (error) {
            console.error(error)
            setError('PayPal payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        setStep('form');
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-blue-600" viewBox="0 0 124 33" fill="currentColor">
                        <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746z" />
                    </svg>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with PayPal</h3>
                <p className="text-sm text-gray-600 mb-4">
                    You&apos;ll be redirected to PayPal to complete your payment securely.
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount to pay:</span>
                    <span className="text-xl font-bold text-gray-900">${amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                    After clicking &quot;Pay with PayPal&quot;, you&apos;ll be redirected to PayPal&apos;s secure payment page.
                </p>
            </div>

            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={handlePayPalPayment}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Redirecting to PayPal...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 124 33" fill="currentColor">
                                <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746z" />
                            </svg>
                            Pay with PayPal
                        </>
                    )}
                </button>
            </div>

            <div className="text-center text-xs text-gray-500">
                <p>🔒 Secure payment powered by PayPal</p>
            </div>
        </div>
    );
}
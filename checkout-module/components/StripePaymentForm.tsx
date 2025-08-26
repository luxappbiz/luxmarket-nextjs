// checkout-module/components/StripePaymentForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useCheckout } from '../context/CheckoutProvider';

interface StripePaymentFormProps {
    clientSecret: string;
    amount: number;
}

function CheckoutForm({ clientSecret, amount }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { processStripePayment, setError, setStep } = useCheckout();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    const handleCardChange = (event: unknown) => {
        const cardEvent = event as { complete: boolean; error?: { message: string } };
        setCardComplete(cardEvent.complete);
        setCardError(cardEvent.error ? cardEvent.error.message : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        const card = elements.getElement(CardElement);
        if (!card) {
            setError('Card element not found');
            setIsProcessing(false);
            return;
        }

        try {
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                },
            });

            if (confirmError) {
                setError(confirmError.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                await processStripePayment(clientSecret);
            } else {
                setError('Payment processing failed. Please try again.');
                setIsProcessing(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        setStep('form');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                </label>
                <div className="p-4 border border-gray-300 rounded-lg">
                    <CardElement
                        id="card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                        onChange={handleCardChange}
                    />
                </div>
                {cardError && (
                    <p className="text-red-600 text-sm mt-1">{cardError}</p>
                )}
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-semibold mb-1">Test Card Numbers:</p>
                <ul className="space-y-1 text-xs">
                    <li>✓ Success: <code>4242 4242 4242 4242</code></li>
                    <li>✗ Decline: <code>4000 0000 0000 0002</code></li>
                    <li>🔐 3D Secure: <code>4000 0000 0000 3220</code></li>
                </ul>
                <p className="text-xs mt-2">Use any future date and any 3-digit CVC</p>
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
                    type="submit"
                    disabled={!stripe || isProcessing || !cardComplete}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment...
                        </>
                    ) : (
                        `Pay $${(amount / 100).toFixed(2)}`
                    )}
                </button>
            </div>
        </form>
    );
}

export function StripePaymentForm({ clientSecret, amount }: StripePaymentFormProps) {
    const { config } = useCheckout();
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    useEffect(() => {
        // Use the Stripe key from the checkout config instead of env variable
        const stripeKey = config.stripePublicKey;
        if (stripeKey) {
            setStripePromise(loadStripe(stripeKey));
        }
    }, [config.stripePublicKey]);

    if (!stripePromise) {
        return (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                <p className="font-semibold">Configuration Error</p>
                <p className="text-sm">Stripe publishable key is not configured. Please add stripePublicKey to your checkout configuration.</p>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} amount={amount} />
        </Elements>
    );
}
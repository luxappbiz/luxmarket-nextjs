// checkout-module/components/CheckoutModule.tsx
'use client';

import React, { useEffect } from 'react';
import { CheckoutProvider, useCheckout } from '../context/CheckoutProvider';
import { CheckoutForm } from './CheckoutForm';
import { PaymentForm } from './PaymentForm';
import { ProcessingState } from './ProcessingState';
import { SuccessState } from './SuccessState';
import { ErrorState } from './ErrorState';
import { OrderSummary } from './OrderSummary';
import {
    CheckoutProps,
    CheckoutConfig,
    CheckoutProduct,
    CheckoutUser,
    CheckoutCallbacks
} from '../types';

// Internal component that uses the context
function CheckoutContent() {
    const { state } = useCheckout();

    const renderCurrentStep = () => {
        switch (state.step) {
            case 'form':
                return <CheckoutForm />;

            case 'payment':
                return <PaymentForm />;

            case 'processing':
                return <ProcessingState />;

            case 'success':
                return <SuccessState />;

            case 'error':
                return <ErrorState />;

            default:
                return <CheckoutForm />;
        }
    };

    return (
        <div className="checkout-module max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center ${['form', 'payment', 'processing', 'success'].includes(state.step)
                                ? 'text-blue-600'
                                : 'text-gray-400'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['form', 'payment', 'processing', 'success'].includes(state.step)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    1
                                </div>
                                <span className="ml-2 text-sm font-medium">Details</span>
                            </div>

                            <div className={`flex-1 h-px ${['payment', 'processing', 'success'].includes(state.step)
                                ? 'bg-blue-600'
                                : 'bg-gray-200'
                                }`} />

                            <div className={`flex items-center ${['payment', 'processing', 'success'].includes(state.step)
                                ? 'text-blue-600'
                                : 'text-gray-400'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${['payment', 'processing', 'success'].includes(state.step)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    2
                                </div>
                                <span className="ml-2 text-sm font-medium">Payment</span>
                            </div>

                            <div className={`flex-1 h-px ${state.step === 'success' ? 'bg-blue-600' : 'bg-gray-200'
                                }`} />

                            <div className={`flex items-center ${state.step === 'success' ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${state.step === 'success'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    3
                                </div>
                                <span className="ml-2 text-sm font-medium">Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Step Content */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        {renderCurrentStep()}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main exported component
export function CheckoutModule({
    products,
    user,
    config,
    callbacks,
    className = ""
}: CheckoutProps) {
    return (
        <div className={`checkout-module-wrapper ${className}`}>
            <CheckoutProvider config={config} callbacks={callbacks}>
                <CheckoutInitializer products={products} user={user} />
                <CheckoutContent />
            </CheckoutProvider>
        </div>
    );
}

// Helper component to initialize data
function CheckoutInitializer({
    products,
    user
}: {
    products: CheckoutProduct[];
    user?: CheckoutUser | null;
}) {
    const { setProducts, setUser } = useCheckout();

    useEffect(() => {
        setProducts(products);
    }, [products, setProducts]);

    useEffect(() => {
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);

    return null;
}

// Simple usage component for quick integration
export function SimpleCheckout({
    productIds,
    quantities,
    user,
    config,
    onSuccess,
    onError
}: {
    productIds: (number | string)[];
    quantities: number[];
    user?: CheckoutUser | null;
    config: CheckoutConfig;
    onSuccess?: (result: {
        orderId?: string;
        orderKey?: string;
        total?: string;
        paymentMethod?: string;
        subscriptionId?: string;
        nextPaymentDate?: string;
    }) => void;
    onError?: (error: string) => void;
}) {
    // Convert productIds and quantities to CheckoutProduct format
    const products: CheckoutProduct[] = productIds.map((id, index) => ({
        id,
        name: `Product ${id}`, // You might want to fetch actual product names
        price: 0, // You might want to fetch actual prices
        quantity: quantities[index] || 1,
    }));

    const callbacks: CheckoutCallbacks = {
        onSuccess,
        onError
    };

    return (
        <CheckoutModule
            products={products}
            user={user}
            config={config}
            callbacks={callbacks}
        />
    );
}
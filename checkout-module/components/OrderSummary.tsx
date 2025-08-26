// checkout-module/components/OrderSummary.tsx
'use client';

import React from 'react';
import { useCheckout } from '../context/CheckoutProvider';

export function OrderSummary() {
    const { state, calculateTotals } = useCheckout();
    const { subtotal, tax, total, taxRate } = calculateTotals();

    if (state.products.length === 0) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <p className="text-gray-500">No items in cart</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                    {state.products.map((item) => (
                        <div key={`${item.id}-${item.variation_id || 0}`} className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                {item.variation_id && (
                                    <p className="text-xs text-gray-400">Variation ID: {item.variation_id}</p>
                                )}
                            </div>
                            <div className="text-right ml-4">
                                <p className="font-medium text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ${item.price.toFixed(2)} each
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    {taxRate > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                            <span className="text-gray-900">${tax.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">Free</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Customer Info */}
                {state.user && (
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Customer</h3>
                        <p className="text-sm text-gray-600">
                            {state.user.first_name} {state.user.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{state.user.email}</p>
                    </div>
                )}

                {/* Payment Method */}
                {state.formData.payment_method && (
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
                        <p className="text-sm text-gray-600 capitalize">
                            {state.formData.payment_method === 'cod' ? 'Cash on Delivery' :
                                state.formData.payment_method === 'stripe' ? 'Credit Card' :
                                    state.formData.payment_method}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
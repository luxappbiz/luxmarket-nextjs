'use client';
// checkout-module/components/SuccessState.tsx
import React from 'react';
import { useCheckout } from '../context/CheckoutProvider';

export function SuccessState() {
  const { state, resetCheckout } = useCheckout();

  const handleContinueShopping = () => {
    resetCheckout();
    // You might want to emit an event or call a callback here
  };

  return (
    <div className="text-center py-12">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Successful!</h1>

      <p className="text-gray-600 mb-6">
        Thank you for your order. We&apos;ve received your payment and will process your order shortly.
      </p>

      {state.orderResult && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <div className="text-sm text-gray-600 mb-2">Order Number</div>
          <div className="text-lg font-semibold text-gray-900 mb-4">#{state.orderResult.orderId}</div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Paid</span>
              <span className="text-xl font-bold text-gray-900">${state.orderResult.total}</span>
            </div>
            {state.orderResult.paymentMethod && (
              <div className="text-sm text-gray-500">
                Payment Method: {state.orderResult.paymentMethod}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3 max-w-md mx-auto">
        <button
          onClick={handleContinueShopping}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>

        {/* <button className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors">
          View Order Details
        </button> */}
      </div>
    </div>
  );
} 
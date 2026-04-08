// checkout-module/components/CheckoutForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useCheckout } from '../context/CheckoutProvider';
import { CheckoutFormData } from '../types';
import { validators } from '../utils/validators';
import { US_STATES, PAYMENT_METHODS } from '../constants';



type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;



export function CheckoutForm() {
    const {
        state,
        updateFormData,
        submitOrder,
        setError,
        config,
        isSubscriptionOrder,
        requiresLogin
    } = useCheckout();

    const [errors, setErrors] = useState<FormErrors>({});
    const [sameAsBilling, setSameAsBilling] = useState(true);

    // Enhanced: Show login requirement for subscriptions
    // useEffect(() => {
    //     if (requiresLogin()) {
    //         setError('Login is required for subscription purchases. Please login and try again.');
    //     }
    // }, [requiresLogin, setError]);

    const enabledPaymentMethods = config.enabledPaymentMethods || ['stripe', 'cod'];
    const isSubscription = isSubscriptionOrder();

    const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
        updateFormData({ [field]: value });

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const [emailToCheck, setEmailToCheck] = useState<string>('');
    const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);

    const checkEmailExists = async (email: string, signal?: AbortSignal): Promise<boolean> => {
    const url = `/api/commerce/wc-checkout/v1/auth/check-email?email=${encodeURIComponent(email)}`;

  const res = await fetch(url, { method: 'GET', signal });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Keep UI usable even if API is down; treat as "unknown"
    console.warn('Email check failed:', data?.message || res.statusText);
    throw new Error(data?.message || 'Email check failed');
  }

  if (data?.success !== true || typeof data?.exists !== 'boolean') {
    console.warn('Unexpected response from check-email:', data);
    throw new Error('Unexpected response');
  }

  return data.exists;
};

   useEffect(() => {
  if (!isSubscription || !requiresLogin()) {
    setIsCheckingEmail(false);
    setEmailExists(null);
    return;
  }
  if (!emailToCheck || !validators.email(emailToCheck)) {
    setEmailExists(null);
    return;
  }

  let cancelled = false;
  const controller = new AbortController();

  setIsCheckingEmail(true);
  const t = setTimeout(async () => {
    try {
      const exists = await checkEmailExists(emailToCheck, controller.signal);
      if (!cancelled) setEmailExists(exists);
    } catch (err) {
      // On error, don't block the user; just clear the state
      if (!cancelled) setEmailExists(null);
    } finally {
      if (!cancelled) setIsCheckingEmail(false);
    }
  }, 400); // same debounce delay

  return () => {
    cancelled = true;
    controller.abort();
    clearTimeout(t);
  };
}, [emailToCheck, isSubscription, requiresLogin]);

    const handleSameAsBillingChange = (checked: boolean) => {
        setSameAsBilling(checked);
        updateFormData({ same_as_billing: checked });

        if (checked) {
            updateFormData({
                shipping_first_name: state.formData.first_name,
                shipping_last_name: state.formData.last_name,
                shipping_address_1: state.formData.address_1,
                shipping_city: state.formData.city,
                shipping_state: state.formData.state,
                shipping_postcode: state.formData.postcode,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (requiresLogin()) {
        //     setError('Please login to complete your subscription purchase');
        //     return;
        // }

        updateFormData({ same_as_billing: sameAsBilling });

        // Block when email exists for subscription + login-required flows
        if (isSubscription && requiresLogin() && emailExists === true) {
            setError('An account with this email already exists. Please log in to purchase a subscription.');
            return;
        }

        if (!validateForm()) {
            setError('Please fill in all required fields correctly');
            return;
        }

        await submitOrder();
    };



    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const data = state.formData;

        const requiredFields = [
            'email', 'first_name', 'last_name',
            'address_1', 'city', 'state', 'postcode', 'payment_method'
        ] as const;

        requiredFields.forEach(field => {
            if (!data[field]) {
                newErrors[field] = getRequiredFieldError(field);
            }
        });

        // Email validation
        if (data.email && !validators.email(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // ZIP code validation
        if (data.postcode && !validators.zipCode(data.postcode)) {
            newErrors.postcode = 'Please enter a valid ZIP code';
        }

        // Subscription-specific validations
        if (isSubscription && data.payment_method === 'cod' && !config.subscriptionsEnabled) {
            newErrors.payment_method = 'Cash on delivery is not available for subscription orders';
        }

        // Password required only for subscription + requiresLogin (stored in CheckoutFormData)
        if (isSubscription && requiresLogin() && !data.password) {
            
            newErrors.password = 'Password is required';
        }

        // Shipping validation (if different from billing)
        if (!sameAsBilling) {
            const shippingFields = [
                'shipping_first_name', 'shipping_last_name',
                'shipping_address_1', 'shipping_city',
                'shipping_state', 'shipping_postcode'
            ] as const;

            shippingFields.forEach(field => {
                if (!data[field]) {
                    newErrors[field] = getShippingFieldError(field);
                }
            });

            if (data.shipping_postcode && !validators.zipCode(data.shipping_postcode)) {
                newErrors.shipping_postcode = 'Please enter a valid shipping ZIP code';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ===================================
    // HELPER FUNCTIONS
    // ===================================

    const getRequiredFieldError = (field: string): string => {
        const fieldNames: Record<string, string> = {
            email: 'Email',
            first_name: 'First name',
            last_name: 'Last name',
            address_1: 'Address',
            city: 'City',
            state: 'State',
            postcode: 'ZIP code',
            payment_method: 'Payment method'
        };
        return `${fieldNames[field]} is required`;
    };

    const getShippingFieldError = (field: string): string => {
        const fieldNames: Record<string, string> = {
            shipping_first_name: 'Shipping first name',
            shipping_last_name: 'Shipping last name',
            shipping_address_1: 'Shipping address',
            shipping_city: 'Shipping city',
            shipping_state: 'Shipping state',
            shipping_postcode: 'Shipping ZIP code'
        };
        return `${fieldNames[field]} is required`;
    };

    const getInputClassName = (field: keyof CheckoutFormData): string => {
        const baseClass = 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
        const errorClass = 'border-red-300';
        const normalClass = 'border-gray-300';

        return `${baseClass} ${errors[field] ? errorClass : normalClass}`;
    };



    const renderHeader = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isSubscription ? 'Subscription Checkout' : 'Checkout Details'}
            </h2>

            {isSubscription && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Subscription Order</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>You&apos;re setting up a recurring subscription. You can cancel anytime from your account dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* {requiresLogin() && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Login Required</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>A user account is required for subscription purchases. Please login to continue.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {state.error}
                    </p>
                </div>
            )}
        </div>
    );

    const renderContactSection = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

            <div className="grid grid-cols-1 md-grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={state.formData.email || ''}
                        onChange={(e) => { handleInputChange('email', e.target.value); setEmailToCheck(e.target.value); }}
                        className={getInputClassName('email')}
                        placeholder="Enter your email"
                        // disabled={requiresLogin()}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                    {isSubscription && requiresLogin() && validators.email(state.formData.email || '') && (
                        <p className="text-sm mt-1">
                            {isCheckingEmail && <span className="text-gray-500">Checking email…</span>}
                            {!isCheckingEmail && emailExists === true && (
                                <span className="text-red-600">
                                    An account with this email already exists. Please log in to purchase a subscription.
                                </span>
                            )}
                            {!isCheckingEmail && emailExists === false && (
                                <span className="text-green-600">Email Valid.</span>
                            )}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={state.formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                        // disabled={requiresLogin()}
                    />
                </div>
            </div>

            {/* Password for subscription + requiresLogin (stored in CheckoutFormData) */}
            {isSubscription && requiresLogin() && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={state.formData.password || ''}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={getInputClassName('password')}
                            placeholder="Create a password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                            Create a password to set up your subscription account.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderBillingSection = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        value={state.formData.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className={getInputClassName('first_name')}
                        placeholder="Enter your first name"
                        // disabled={requiresLogin()}
                    />
                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        value={state.formData.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className={getInputClassName('last_name')}
                        placeholder="Enter your last name"
                        // disabled={requiresLogin()}
                    />
                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="address_1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                </label>
                <input
                    id="address_1"
                    type="text"
                    value={state.formData.address_1 || ''}
                    onChange={(e) => handleInputChange('address_1', e.target.value)}
                    className={getInputClassName('address_1')}
                    placeholder="Enter your address"
                    // disabled={requiresLogin()}
                />
                {errors.address_1 && <p className="text-red-500 text-sm mt-1">{errors.address_1}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={state.formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={getInputClassName('city')}
                        placeholder="Enter your city"
                        // disabled={requiresLogin()}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                    </label>
                    <select
                        id="state"
                        value={state.formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={getInputClassName('state')}
                        // disabled={requiresLogin()}
                    >
                        <option value="">Select a state</option>
                        {US_STATES.map((stateName) => (
                            <option key={stateName} value={stateName}>
                                {stateName}
                            </option>
                        ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                    </label>
                    <input
                        id="postcode"
                        type="text"
                        value={state.formData.postcode || ''}
                        onChange={(e) => handleInputChange('postcode', e.target.value)}
                        className={getInputClassName('postcode')}
                        placeholder="Enter ZIP code"
                        // disabled={requiresLogin()}
                    />
                    {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
                </div>
            </div>
        </div>
    );

    const renderShippingSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="same_as_billing"
                        checked={sameAsBilling}
                        onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        // disabled={requiresLogin()}
                    />
                    <label htmlFor="same_as_billing" className="text-sm text-gray-700 cursor-pointer">
                        Same as billing address
                    </label>
                </div>
            </div>

            {!sameAsBilling ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="shipping_first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                id="shipping_first_name"
                                type="text"
                                value={state.formData.shipping_first_name || ''}
                                onChange={(e) => handleInputChange('shipping_first_name', e.target.value)}
                                className={getInputClassName('shipping_first_name')}
                                placeholder="Enter first name"
                                // disabled={requiresLogin()}
                            />
                            {errors.shipping_first_name && <p className="text-red-500 text-sm mt-1">{errors.shipping_first_name}</p>}
                        </div>

                        <div>
                            <label htmlFor="shipping_last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <input
                                id="shipping_last_name"
                                type="text"
                                value={state.formData.shipping_last_name || ''}
                                onChange={(e) => handleInputChange('shipping_last_name', e.target.value)}
                                className={getInputClassName('shipping_last_name')}
                                placeholder="Enter last name"
                                disabled={requiresLogin()}
                            />
                            {errors.shipping_last_name && <p className="text-red-500 text-sm mt-1">{errors.shipping_last_name}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="shipping_address_1" className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <input
                            id="shipping_address_1"
                            type="text"
                            value={state.formData.shipping_address_1 || ''}
                            onChange={(e) => handleInputChange('shipping_address_1', e.target.value)}
                            className={getInputClassName('shipping_address_1')}
                            placeholder="Enter shipping address"
                            // disabled={requiresLogin()}
                        />
                        {errors.shipping_address_1 && <p className="text-red-500 text-sm mt-1">{errors.shipping_address_1}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                id="shipping_city"
                                type="text"
                                value={state.formData.shipping_city || ''}
                                onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                                className={getInputClassName('shipping_city')}
                                placeholder="Enter city"
                                // disabled={requiresLogin()}
                            />
                            {errors.shipping_city && <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>}
                        </div>

                        <div>
                            <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <select
                                id="shipping_state"
                                value={state.formData.shipping_state || ''}
                                onChange={(e) => handleInputChange('shipping_state', e.target.value)}
                                className={getInputClassName('shipping_state')}
                                // disabled={requiresLogin()}
                            >
                                <option value="">Select a state</option>
                                {US_STATES.map((stateName) => (
                                    <option key={stateName} value={stateName}>
                                        {stateName}
                                    </option>
                                ))}
                            </select>
                            {errors.shipping_state && <p className="text-red-500 text-sm mt-1">{errors.shipping_state}</p>}
                        </div>

                        <div>
                            <label htmlFor="shipping_postcode" className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code *
                            </label>
                            <input
                                id="shipping_postcode"
                                type="text"
                                value={state.formData.shipping_postcode || ''}
                                onChange={(e) => handleInputChange('shipping_postcode', e.target.value)}
                                className={getInputClassName('shipping_postcode')}
                                placeholder="Enter ZIP code"
                                // disabled={requiresLogin()}
                            />
                            {errors.shipping_postcode && <p className="text-red-500 text-sm mt-1">{errors.shipping_postcode}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                        📦 Items will be shipped to the same address as your billing address.
                    </p>
                </div>
            )}
        </div>
    );

    const renderPaymentSection = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>

            <div className="space-y-3">
                {enabledPaymentMethods.includes(PAYMENT_METHODS.STRIPE as 'stripe') && (
                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                        <input
                            type="radio"
                            name="payment_method"
                            value={PAYMENT_METHODS.STRIPE}
                            checked={state.formData.payment_method === PAYMENT_METHODS.STRIPE}
                            onChange={(e) => handleInputChange('payment_method', e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            // disabled={requiresLogin()}
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">
                                {isSubscription
                                    ? 'Secure recurring payments with Stripe'
                                    : 'Pay securely with your card'
                                }
                            </div>
                            {isSubscription && (
                                <div className="text-xs text-blue-600 mt-1">
                                    Recommended for subscriptions
                                </div>
                            )}
                        </div>
                    </label>
                )}

                {enabledPaymentMethods.includes(PAYMENT_METHODS.COD as 'cod') && (
                    <label className={`flex items-start space-x-3 p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer ${isSubscription ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-500'
                        }`}>
                        <input
                            type="radio"
                            name="payment_method"
                            value={PAYMENT_METHODS.COD}
                            checked={state.formData.payment_method === PAYMENT_METHODS.COD}
                            onChange={(e) => handleInputChange('payment_method', e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            disabled={requiresLogin() || isSubscription}
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">
                                {isSubscription
                                    ? 'Not available for subscription orders'
                                    : 'Pay when you receive your order'
                                }
                            </div>
                            {isSubscription && (
                                <div className="text-xs text-red-600 mt-1">
                                    Subscriptions require automatic payment methods
                                </div>
                            )}
                        </div>
                    </label>
                )}
            </div>

            {errors.payment_method && (
                <p className="text-red-500 text-sm">{errors.payment_method}</p>
            )}
        </div>
    );

    const renderSubscriptionTerms = () => {
        if (!isSubscription) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="subscription_terms"
                        checked={state.formData.subscription_terms_accepted || false}
                        onChange={(e) => handleInputChange('subscription_terms_accepted', e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        // disabled={requiresLogin()}
                    />
                    <label htmlFor="subscription_terms" className="text-sm text-gray-700">
                        I understand this is a recurring subscription that will automatically renew until cancelled.
                        I can cancel anytime from my account dashboard.
                    </label>
                </div>
            </div>
        );
    };

    const renderSubmitButton = () => {
        // keep submit button diabled until checkbox is cheecked (for subscriptions)
        const mustAcceptTerms = isSubscription && !(state.formData.subscription_terms_accepted);
        const emailBlock = isSubscription && requiresLogin() && (emailExists === true);
        const isSubmitDisabled = state.isLoading || mustAcceptTerms || isCheckingEmail || emailBlock;

        return (
            <div className="pt-6">
                {/* <button
                    type="submit"
                    disabled={state.isLoading || requiresLogin()}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {state.isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : requiresLogin() ? (
                        'Login Required'
                    ) : isSubscription ? (
                        state.formData.payment_method === PAYMENT_METHODS.COD ? 'Set Up Subscription' : 'Continue to Payment'
                    ) : (
                        state.formData.payment_method === PAYMENT_METHODS.COD ? 'Place Order' : 'Continue to Payment'
                    )}
                </button> */}
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {state.isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) :  isSubscription ? (
                        state.formData.payment_method === PAYMENT_METHODS.COD ? 'Set Up Subscription' : 'Continue to Payment'
                    ) : (
                        state.formData.payment_method === PAYMENT_METHODS.COD ? 'Place Order' : 'Continue to Payment'
                    )}
                </button>

                <div className="text-center text-sm text-gray-500 mt-4">
                    <p>🔒 Your information is secure and encrypted</p>
                    {isSubscription && (
                        <p className="mt-1">Subscription can be cancelled anytime</p>
                    )}
                </div>
            </div>
        );
    };

    // ===================================
    // MAIN RENDER
    // ===================================

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {renderHeader()}
            {renderContactSection()}
            {renderBillingSection()}
            {renderShippingSection()}
            {renderPaymentSection()}
            {renderSubscriptionTerms()}
            {renderSubmitButton()}
        </form>
    );
}

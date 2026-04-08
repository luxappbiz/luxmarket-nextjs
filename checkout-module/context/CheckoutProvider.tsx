// checkout-module/context/CheckoutProvider.tsx

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { CheckoutAPI } from '../lib/checkout-api';
import {
  CheckoutState,
  CheckoutProduct,
  CheckoutUser,
  CheckoutFormData,
  CheckoutContextType,
  CheckoutProviderProps,
  CheckoutAction
} from '../types';



const initialState: CheckoutState = {
  step: 'form',
  isLoading: false,
  error: null,
  formData: {},
  products: [],
  user: null,
  paymentData: {
    amount: 0,
    currency: 'USD'
  },
  orderResult: null
};



function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };

    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_PAYMENT_DATA':
      return {
        ...state,
        paymentData: { ...state.paymentData, ...action.payload }
      };

    case 'SET_ORDER_RESULT':
      return { ...state, orderResult: action.payload };

    case 'RESET_CHECKOUT':
      return { ...initialState, products: state.products, user: state.user };

    default:
      return state;
  }
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children, config, callbacks }: CheckoutProviderProps) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  // Initialize API
  const checkoutAPI = React.useMemo(() => new CheckoutAPI(config), [config]);

  // ===================================
  // EFFECTS
  // ===================================

  // Auto-load user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lux_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);

        const checkoutUser: CheckoutUser = {
          id: user.ID || user.id,
          email: user.email || user.user_email,
          first_name: user.name?.split(' ')[0] || user.first_name || '',
          last_name: user.name?.split(' ').slice(1).join(' ') || user.last_name || '',
          token: user.token
        };

        dispatch({ type: 'SET_USER', payload: checkoutUser });
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }, []);

  // Set auth token when user changes
  useEffect(() => {
    if (state.user?.token) {
      checkoutAPI.setAuthToken(state.user.token);
    } else {
      checkoutAPI.clearAuthToken();
    }
  }, [state.user?.token, checkoutAPI]);

  // Auto-fill form data when user changes
  useEffect(() => {
    if (state.user) {
      const autoFillData: Partial<CheckoutFormData> = {
        email: state.user.email ||state.user.user_email || state.user.billing?.email || '',
        first_name: state.user.first_name || state.user.billing?.first_name || '',
        last_name: state.user.last_name || state.user.billing?.last_name || '',
        phone: state.user.billing?.phone || '',
        address_1: state.user.billing?.address_1 || '',
        city: state.user.billing?.city || '',
        state: state.user.billing?.state || '',
        postcode: state.user.billing?.postcode || '',
      };

      const filteredData = Object.fromEntries(
        Object.entries(autoFillData).filter(([, value]) =>
          value && typeof value === 'string' && value.trim() !== ''
        )
      );

      if (Object.keys(filteredData).length > 0) {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: filteredData });
      }
    }
  }, [state.user]);

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================

  const isSubscriptionOrder = useCallback(() => {
    return state.products.some(product =>
      product.is_subscription ||
      product.subscription_period ||
      product.subscription_interval
    );
  }, [state.products]);

  const requiresLogin = useCallback(() => {
    return isSubscriptionOrder() && !state.user;
  }, [isSubscriptionOrder, state.user]);

  const calculateTotals = useCallback(() => {
    const subtotal = state.products.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );
    const taxRate = config.taxRate || 0;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return { subtotal, tax, total, taxRate };
  }, [state.products, config.taxRate]);

  // ===================================
  // ACTION FUNCTIONS
  // ===================================

  const setProducts = useCallback((products: CheckoutProduct[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, []);

  const setUser = useCallback((user: CheckoutUser | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const updateFormData = useCallback((data: Partial<CheckoutFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  const setStep = useCallback((step: CheckoutState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    if (error) {
      callbacks?.onError?.(error);
    }
  }, [callbacks]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const resetCheckout = useCallback(() => {
    dispatch({ type: 'RESET_CHECKOUT' });
  }, []);

  // ===================================
  // ORDER PROCESSING
  // ===================================

  const buildOrderData = useCallback(() => {
    return {
      billing: {
        first_name: state.formData.first_name!,
        last_name: state.formData.last_name!,
        email: state.formData.email!,
        phone: state.formData.phone || '',
        address_1: state.formData.address_1!,
        city: state.formData.city!,
        state: state.formData.state!,
        postcode: state.formData.postcode!,
        country: 'US'
      },
      shipping: state.formData.same_as_billing ? undefined : {
        first_name: state.formData.shipping_first_name!,
        last_name: state.formData.shipping_last_name!,
        address_1: state.formData.shipping_address_1!,
        city: state.formData.shipping_city!,
        state: state.formData.shipping_state!,
        postcode: state.formData.shipping_postcode!,
        country: 'US'
      },
      line_items: state.products.map(item => ({
        product_id: item.id,
        variation_id: item.variation_id || 0,
        quantity: item.quantity,
        subscription_period: item.subscription_period || 'month',
        subscription_interval: item.subscription_interval || 1
      })),
      payment_method: state.formData.payment_method!,
      customer_id: state.user?.id || 1,
      set_paid: false,
      billing_period: state.products[0]?.subscription_period || 'month',
      billing_interval: state.products[0]?.subscription_interval || 1
    };
  }, [state.formData, state.products, state.user]);

  // const submitOrder = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     if (requiresLogin()) {
  //       setError('Please login to purchase subscription plans');
  //       setStep('error');
  //       return;
  //     }

  //     const { total } = calculateTotals();
  //     const isSubscription = isSubscriptionOrder();

  //     const orderData = buildOrderData();

  //     dispatch({
  //       type: 'SET_PAYMENT_DATA',
  //       payload: {
  //         amount: Math.round(total * 100),
  //         currency: config.currency || 'USD'
  //       }
  //     });

  //     if (state.formData.payment_method === 'stripe') {
  //       const paymentResponse = await checkoutAPI.createStripePaymentIntent({
  //         amount: Math.round(total * 100),
  //         currency: config.currency || 'USD',
  //         setup_future_usage: isSubscription ? 'off_session' : undefined,
  //         metadata: {
  //           customer_email: state.formData.email,
  //           customer_name: `${state.formData.first_name} ${state.formData.last_name}`,
  //           customer_id: state.user?.id?.toString(),
  //           is_subscription: isSubscription.toString()
  //         }
  //       });

  //       if (!paymentResponse.success) {
  //         throw new Error(paymentResponse.error || 'Payment setup failed');
  //       }

  //       dispatch({
  //         type: 'SET_PAYMENT_DATA',
  //         payload: { stripeClientSecret: paymentResponse.clientSecret }
  //       });
  //       setStep('payment');

  //     } else if (state.formData.payment_method === 'cod') {
  //       if (isSubscription) {
  //         const subscriptionData = {
  //           ...orderData,
  //           line_items: state.products.map(item => ({
  //             product_id: item.id,
  //             variation_id: item.variation_id || 0,
  //             quantity: item.quantity,
  //             subscription_period: item.subscription_period || 'month',
  //             subscription_interval: item.subscription_interval || 1,
  //             price: item.price
  //           })),
  //           total: total,
  //           currency: config.currency || 'USD'
  //         };

  //         const subscriptionResponse = await checkoutAPI.createSubscription(subscriptionData);

  //         if (!subscriptionResponse.success) {
  //           throw new Error(subscriptionResponse.error || 'Subscription creation failed');
  //         }

  //         const subscription = subscriptionResponse.subscription;
  //         if (!subscription) {
  //           throw new Error('Subscription data not found in response');
  //         }

  //         const subscriptionId = subscription.id?.toString() || 'unknown';
  //         const orderKey = subscription.order_key || '';
  //         const subscriptionTotal = subscription.total?.toString() || total.toString();

  //         dispatch({
  //           type: 'SET_ORDER_RESULT',
  //           payload: {
  //             orderId: subscriptionId,
  //             orderKey: orderKey,
  //             total: subscriptionTotal,
  //             paymentMethod: subscription.payment_method || 'Cash on Delivery',
  //             subscriptionId: subscriptionId,
  //             nextPaymentDate: subscription.next_payment_date,
  //             billingPeriod: subscription.billing_period
  //           }
  //         });

  //         setStep('success');

  //         callbacks?.onSuccess?.({
  //           orderId: subscriptionId,
  //           orderKey: orderKey,
  //           total: subscriptionTotal,
  //           paymentMethod: subscription.payment_method || 'Cash on Delivery',
  //           subscriptionId: subscriptionId,
  //           nextPaymentDate: subscription.next_payment_date
  //         });

  //         if (callbacks?.onSubscriptionCreated) {
  //           callbacks.onSubscriptionCreated(subscriptionResponse);
  //         }

  //       } else {
  //         const orderResponse = await checkoutAPI.createOrder({
  //           ...orderData,
  //           set_paid: false
  //         });

  //         if (!orderResponse.success) {
  //           throw new Error(orderResponse.error || 'Order creation failed');
  //         }

  //         const order = orderResponse.order!;
  //         dispatch({
  //           type: 'SET_ORDER_RESULT',
  //           payload: {
  //             orderId: order.id.toString(),
  //             orderKey: order.order_key,
  //             total: order.total,
  //             paymentMethod: order.payment_method_title || 'Cash on Delivery'
  //           }
  //         });

  //         setStep('success');

  //         callbacks?.onSuccess?.({
  //           orderId: order.id.toString(),
  //           orderKey: order.order_key,
  //           total: order.total,
  //           paymentMethod: order.payment_method_title || 'Cash on Delivery'
  //         });
  //       }
  //     }

  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Order submission failed';
  //     console.error('Order submission error:', error);
  //     setError(errorMessage);
  //     setStep('error');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [
  //   state,
  //   config,
  //   checkoutAPI,
  //   calculateTotals,
  //   callbacks,
  //   isSubscriptionOrder,
  //   requiresLogin,
  //   buildOrderData
  // ]);

  const submitOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // if (requiresLogin()) {
      //   setError('Please login to purchase subscription plans');
      //   setStep('error');
      //   return;
      // }

      const { total } = calculateTotals();
      const isSubscription = isSubscriptionOrder();

      const orderData = buildOrderData();

      dispatch({
        type: 'SET_PAYMENT_DATA',
        payload: {
          amount: Math.round(total * 100),
          currency: config.currency || 'USD'
        }
      });

      if (state.formData.payment_method === 'stripe') {
        const paymentResponse = await checkoutAPI.createStripePaymentIntent({
          amount: Math.round(total * 100),
          currency: config.currency || 'USD',
          setup_future_usage: isSubscription ? 'off_session' : undefined,
          metadata: {
            customer_email: state.formData.email || '',
            customer_name: `${state.formData.first_name || ''} ${state.formData.last_name || ''}`,
            customer_id: state.user?.id?.toString() || '',
            is_subscription: isSubscription.toString()
          }
        });

        if (!paymentResponse.success) {
          throw new Error(paymentResponse.error || 'Payment setup failed');
        }

        dispatch({
          type: 'SET_PAYMENT_DATA',
          payload: { stripeClientSecret: paymentResponse.clientSecret }
        });
        setStep('payment');

      } else if (state.formData.payment_method === 'cod') {
        if (isSubscription) {
          const subscriptionData = {
            ...orderData,
            line_items: state.products.map(item => ({
              product_id: item.id,
              variation_id: item.variation_id || 0,
              quantity: item.quantity,
              subscription_period: item.subscription_period || 'month',
              subscription_interval: item.subscription_interval || 1,
              price: item.price
            })),
            total: total,
            currency: config.currency || 'USD',
            password: requiresLogin() ? (state.formData.password || '') : undefined
          };

          const subscriptionResponse = await checkoutAPI.createSubscription(subscriptionData);

          if (!subscriptionResponse.success) {
            throw new Error(subscriptionResponse.error || 'Subscription creation failed');
          }

          const subscription = subscriptionResponse.subscription;
          if (!subscription) {
            throw new Error('Subscription data not found in response');
          }

          const subscriptionId = subscription.id?.toString() || 'unknown';
          const orderKey = subscription.order_key || '';
          const subscriptionTotal = subscription.total?.toString() || total.toString();

          dispatch({
            type: 'SET_ORDER_RESULT',
            payload: {
              orderId: subscriptionId,
              orderKey: orderKey,
              total: subscriptionTotal,
              paymentMethod: subscription.payment_method || 'Cash on Delivery',
              subscriptionId: subscriptionId,
              nextPaymentDate: subscription.next_payment_date,
              billingPeriod: subscription.billing_period
            }
          });

          setStep('success');

          callbacks?.onSuccess?.({
            orderId: subscriptionId,
            orderKey: orderKey,
            total: subscriptionTotal,
            paymentMethod: subscription.payment_method || 'Cash on Delivery',
            subscriptionId: subscriptionId,
            nextPaymentDate: subscription.next_payment_date
          });

          if (callbacks?.onSubscriptionCreated) {
            callbacks.onSubscriptionCreated(subscriptionResponse);
          }

        } else {
          const orderResponse = await checkoutAPI.createOrder({
            ...orderData,
            set_paid: false
          });

          if (!orderResponse.success) {
            throw new Error(orderResponse.error || 'Order creation failed');
          }

          const order = orderResponse.order!;
          dispatch({
            type: 'SET_ORDER_RESULT',
            payload: {
              orderId: order.id.toString(),
              orderKey: order.order_key,
              total: order.total,
              paymentMethod: order.payment_method_title || 'Cash on Delivery'
            }
          });

          setStep('success');

          callbacks?.onSuccess?.({
            orderId: order.id.toString(),
            orderKey: order.order_key,
            total: order.total,
            paymentMethod: order.payment_method_title || 'Cash on Delivery'
          });
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Order submission failed';
      console.error('Order submission error:', error);
      setError(errorMessage);
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, [
    state,
    config.currency,
    checkoutAPI,
    calculateTotals,
    callbacks,
    isSubscriptionOrder,
    requiresLogin,
    buildOrderData,
    setError,
    setLoading,
    setStep
  ]);

  const processStripePayment = useCallback(async (clientSecret: string) => {
    try {
      setLoading(true);
      const isSubscription = isSubscriptionOrder();
      const { total } = calculateTotals();

      const orderData = {
        ...buildOrderData(),
        payment_method: 'stripe' as const,
        set_paid: true,
        transaction_id: clientSecret.split('_secret')[0]
      };

      if (isSubscription) {
        const subscriptionData = {
          ...orderData,
          line_items: state.products.map(item => ({
            product_id: item.id,
            variation_id: item.variation_id || 0,
            quantity: item.quantity,
            subscription_period: item.subscription_period || 'month',
            subscription_interval: item.subscription_interval || 1,
            price: item.price
          })),
          total: total,
          currency: config.currency || 'USD',
           password: requiresLogin() ? (state.formData.password || '') : undefined
        };

        const subscriptionResponse = await checkoutAPI.createSubscription(subscriptionData);

        if (!subscriptionResponse.success) {
          throw new Error(subscriptionResponse.error || 'Subscription creation failed');
        }

        const subscription = subscriptionResponse.subscription;
        if (!subscription) {
          throw new Error('Subscription data not found in response');
        }

        const subscriptionId = subscription.id?.toString() || 'unknown';
        const orderKey = subscription.order_key || '';
        const subscriptionTotal = subscription.total?.toString() || total.toString();

        dispatch({
          type: 'SET_ORDER_RESULT',
          payload: {
            orderId: subscriptionId,
            orderKey: orderKey,
            total: subscriptionTotal,
            paymentMethod: subscription.payment_method || 'Credit Card',
            subscriptionId: subscriptionId,
            nextPaymentDate: subscription.next_payment_date,
            billingPeriod: subscription.billing_period
          }
        });

        setStep('success');

        callbacks?.onSuccess?.({
          orderId: subscriptionId,
          orderKey: orderKey,
          total: subscriptionTotal,
          paymentMethod: subscription.payment_method || 'Credit Card',
          subscriptionId: subscriptionId,
          nextPaymentDate: subscription.next_payment_date
        });

        if (callbacks?.onSubscriptionCreated) {
          callbacks.onSubscriptionCreated(subscriptionResponse);
        }

      } else {
        const orderResponse = await checkoutAPI.createOrder(orderData);

        if (!orderResponse.success) {
          throw new Error(orderResponse.error || 'Order creation failed');
        }

        const order = orderResponse.order!;
        dispatch({
          type: 'SET_ORDER_RESULT',
          payload: {
            orderId: order.id.toString(),
            orderKey: order.order_key,
            total: order.total,
            paymentMethod: order.payment_method_title || 'Credit Card'
          }
        });

        setStep('success');

        callbacks?.onSuccess?.({
          orderId: order.id.toString(),
          orderKey: order.order_key,
          total: order.total,
          paymentMethod: order.payment_method_title || 'Credit Card'
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Order creation failed';
      console.error('Stripe payment processing error:', error);
      setError(errorMessage);
      setStep('error');
    } finally {
      setLoading(false);
    }

  }, [state, config.currency, checkoutAPI, callbacks, isSubscriptionOrder, calculateTotals, buildOrderData, setError, setLoading, setStep]);

  const processCODPayment = useCallback(async () => {
    // COD is handled in submitOrder
  }, []);

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const contextValue: CheckoutContextType = {
    state,
    config,
    setProducts,
    setUser,
    updateFormData,
    setStep,
    setError,
    setLoading,
    submitOrder,
    processStripePayment,
    processCODPayment,
    calculateTotals,
    resetCheckout,
    isSubscriptionOrder,
    requiresLogin
  };

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
}

// ===================================
// HOOK
// ===================================

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

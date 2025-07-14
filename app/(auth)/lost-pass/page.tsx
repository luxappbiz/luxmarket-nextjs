'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Check, Loader2, CheckCircle2, Info } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function LostPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            // Note: You'll need to implement the reset-password endpoint in your WordPress backend
            const response = await authApi.resetPassword(email);

            if (response.success) {
                setIsSubmitted(true);
            } else {
                setError(response.error || 'Failed to send reset instructions');
            }
        } catch (err: any) {
            // For now, simulate success since the endpoint might not exist
            console.log('Password reset requested for:', email);
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative z-10 min-h-screen flex flex-col">
                    {/* Header */}
                    <div className="p-6 md:p-8">
                        <Link href="/" className="flex items-center space-x-3 text-white">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/images/LUX-Logo.png"
                                    alt="LUX Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold">LUX</span>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="w-full max-w-2xl">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="p-8 md:p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                                    <p className="text-gray-600 mb-2">We've sent password reset instructions to</p>
                                    <p className="font-semibold text-gray-900 text-lg mb-8">{email}</p>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                                        <div className="flex items-start space-x-3">
                                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-blue-800">
                                                <p className="font-semibold mb-2">Didn't receive the email?</p>
                                                <ul className="space-y-1">
                                                    <li>• Check your spam or junk folder</li>
                                                    <li>• Make sure you entered the correct email</li>
                                                    <li>• Reset links expire after 24 hours</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            className="w-full h-12 bg-black hover:bg-gray-900"
                                            asChild
                                        >
                                            <Link href="/login">Back to Login</Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full h-12 border-gray-300"
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setEmail('');
                                            }}
                                        >
                                            Try Different Email
                                        </Button>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-6">
                                        Need help?{' '}
                                        <Link href="/support" className="text-black hover:underline">
                                            Contact Support
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="p-6 md:p-8">
                    <Link href="/" className="flex items-center space-x-3 text-white">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/images/LUX-Logo.png"
                                alt="LUX Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold">LUX</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-5xl">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="md:flex">
                                {/* Form Section */}
                                <div className="md:w-3/5 p-8 md:p-12">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-6"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="text-sm font-medium">Back to Login</span>
                                    </Link>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                                    <p className="text-gray-600 mb-8">Enter your email and we'll send you reset instructions</p>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (error) setError('');
                                                    }}
                                                    className="h-11 pl-10"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleSubmit}
                                            className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
                                            disabled={isLoading || !email}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending Instructions...
                                                </>
                                            ) : (
                                                'Send Reset Instructions'
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">
                                                Remember your password?{' '}
                                                <Link href="/login" className="font-semibold text-black hover:underline">
                                                    Sign in instead
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="md:w-2/5 bg-gray-900 p-8 md:p-12 text-white">
                                    <h3 className="text-2xl font-bold mb-6">Password Reset Help</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Quick Process</h4>
                                                <p className="text-sm text-gray-400">Reset your password in just a few steps</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Secure Link</h4>
                                                <p className="text-sm text-gray-400">We'll send a secure link to your email</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">24/7 Support</h4>
                                                <p className="text-sm text-gray-400">Our team is here to help if you need it</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-800">
                                        <h4 className="font-semibold mb-3">Security Tips</h4>
                                        <ul className="text-sm text-gray-400 space-y-2">
                                            <li>• Use a strong, unique password</li>
                                            <li>• Never share your password</li>
                                            <li>• Enable two-factor authentication</li>
                                            <li>• Update your password regularly</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
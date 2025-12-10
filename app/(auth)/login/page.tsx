'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-5xl">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-3/5 p-8 md:p-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                                    <p className="text-gray-600 mb-8">Log in to your LUX account</p>
                                    <LoginForm />
                                </div>
                                <div className="md:w-2/5 bg-zinc-900 p-8 md:p-12 text-white">
                                    <h3 className="text-2xl font-bold mb-6">Welcome to LUX</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Secure Platform</h4>
                                                <p className="text-sm text-gray-400">Your data is protected with industry-standard encryption</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Quick Access</h4>
                                                <p className="text-sm text-gray-400">Sign in with email or username</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Mobile App</h4>
                                                <p className="text-sm text-gray-400">Access LUX on the go with our iOS app</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-800">
                                        <p className="text-sm text-gray-400 mb-4">Download our mobile app</p>
                                        <Link
                                            href="https://apps.apple.com/us/app/my-lux-market/id6738446545"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block transition-transform duration-200 hover:scale-105"
                                        >
                                            <Image
                                                src="/images/app-store.svg"
                                                alt="Download on the App Store"
                                                width={140}
                                                height={48}
                                                className="h-10 w-auto"
                                            />
                                        </Link>
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
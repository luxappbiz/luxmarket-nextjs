'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, Loader2, Mail, Lock } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.login || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            const response = await authApi.login(formData.login, formData.password);
            if (response.success) {
                login(
                    response.token,
                    response.user,
                    formData.rememberMe,
                    response.application_password
                );
                router.push('/account');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        if (error) setError('');
    };

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
                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="login">Email or Username</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="login"
                                                    name="login"
                                                    type="text"
                                                    placeholder="john@example.com or johndoe"
                                                    value={formData.login}
                                                    onChange={handleChange}
                                                    className="h-11 pl-10"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <Link
                                                    href="/lost-pass"
                                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="h-11 pl-10 pr-10"
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isLoading}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                                                disabled={isLoading}
                                            />
                                            <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                                                Remember me for 30 days
                                            </Label>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Signing In...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </Button>

                                        <p className="text-center text-sm text-gray-600 pt-2">
                                            Don't have an account?{' '}
                                            <Link href="/join" className="font-semibold text-black hover:underline">
                                                Create an account
                                            </Link>
                                        </p>
                                    </form>
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
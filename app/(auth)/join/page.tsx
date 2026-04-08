'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { loginAction } from '@/app/actions/auth';

export default function JoinPage() {
    const router = useRouter();
    const { login } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const passwordRequirements = [
        { met: formData.password.length >= 8, text: 'At least 8 characters' },
        { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
        { met: /[0-9]/.test(formData.password), text: 'One number' },
        { met: /[!@#$%^&*]/.test(formData.password), text: 'One special character' }
    ];

    const isPasswordValid = passwordRequirements.every(req => req.met);
    const doPasswordsMatch = formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Validate form
        if (!formData.termsAccepted) {
            setError('Please accept the terms and conditions');
            return;
        }
        if (!isPasswordValid) {
            setError('Password does not meet requirements');
            return;
        }
        if (!doPasswordsMatch) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            const response = await authApi.register(formData.email, formData.password);
            if (response.success) {
                await loginAction({
                    token: response.token,
                    user: response.user,
                    appPassword: response.application_password,
                });
                login(
                    response.token,
                    response.user,
                    false,
                    response.application_password
                );
                router.push('/account');
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
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
        // Clear error when user starts typing
        if (error) setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Background Pattern */}
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
                                {/* Form Section */}
                                <div className="md:w-3/5 p-8 md:p-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join LUX Today</h2>
                                    <p className="text-gray-600 mb-8">Start your journey into luxury</p>
                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="h-11"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    // placeholder="Create a strong password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="h-11 pr-10"
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
                                            {formData.password && (
                                                <div className="mt-2 space-y-1">
                                                    {passwordRequirements.map((req, index) => (
                                                        <div key={index} className="flex items-center space-x-2 text-sm">
                                                            {req.met ? (
                                                                <Check className="h-3 w-3 text-green-500" />
                                                            ) : (
                                                                <X className="h-3 w-3 text-gray-300" />
                                                            )}
                                                            <span className={req.met ? 'text-green-600' : 'text-gray-400'}>
                                                                {req.text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    // placeholder="Confirm your password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="h-11"
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={isLoading}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </Button>
                                            </div>
                                            {formData.confirmPassword && !doPasswordsMatch && (
                                                <p className="text-sm text-red-600">Passwords do not match</p>
                                            )}
                                        </div>
                                        <div className="flex items-start space-x-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="termsAccepted"
                                                name="termsAccepted"
                                                checked={formData.termsAccepted}
                                                onChange={handleChange}
                                                className="h-4 w-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black"
                                                required
                                                disabled={isLoading}
                                            />
                                            <Label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer">
                                                I agree to the{' '}
                                                <Link href="/terms" className="text-black hover:underline">
                                                    Terms of Service
                                                </Link>{' '}
                                                and{' '}
                                                <Link href="/privacy" className="text-black hover:underline">
                                                    Privacy Policy
                                                </Link>
                                            </Label>
                                        </div>
                                        <Button
                                            onClick={handleSubmit}
                                            className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
                                            disabled={isLoading || !formData.termsAccepted || !isPasswordValid || !doPasswordsMatch}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                        <p className="text-center text-sm text-gray-600 pt-2">
                                            Already have an account?{' '}
                                            <Link href="/login" className="font-semibold text-black hover:underline">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                {/* Benefits Section */}
                                <div className="md:w-2/5 bg-gray-900 p-8 md:p-12 text-white">
                                    <h3 className="text-2xl font-bold mb-6">Member Benefits</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Exclusive Access</h4>
                                                <p className="text-sm text-gray-400">First look at premium luxury items</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Verified Sellers</h4>
                                                <p className="text-sm text-gray-400">All sellers are thoroughly vetted</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Premium Support</h4>
                                                <p className="text-sm text-gray-400">24/7 dedicated customer service</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">Member Events</h4>
                                                <p className="text-sm text-gray-400">Exclusive invites to luxury events</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="mt-8 pt-8 border-t border-gray-800">
                                        <p className="text-sm text-gray-400">Join over 10,000 luxury enthusiasts</p>
                                        <div className="flex items-center mt-4 -space-x-2">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900"
                                                />
                                            ))}
                                            <div className="w-8 h-8 bg-black rounded-full border-2 border-gray-900 flex items-center justify-center">
                                                <span className="text-xs">+</span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

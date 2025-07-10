'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { authApi, tokenStorage } from '@/lib/api';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        login: '',
        password: ''
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
                // Store token and user data
                tokenStorage.setToken(response.token);
                tokenStorage.setUser(response.user);

                // Store application password if needed
                if (response.application_password) {
                    localStorage.setItem('lux_app_password', response.application_password);
                }

                // Close dialog first
                onClose();

                // Then redirect based on membership status
                if (response.user.has_active_membership) {
                    router.push('/account');
                } else {
                    router.push('/membership'); // Redirect to membership page if no active membership
                }
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    // Reset form when dialog closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setFormData({ login: '', password: '' });
            setError('');
            setShowPassword(false);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="dialog-login">Username or Email</Label>
                        <Input
                            id="dialog-login"
                            name="login"
                            type="text"
                            placeholder="Enter your username or email"
                            value={formData.login}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dialog-password">Password</Label>
                        <div className="relative">
                            <Input
                                id="dialog-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pr-10"
                                disabled={isLoading}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">
                                    {showPassword ? 'Hide password' : 'Show password'}
                                </span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link
                            href="/lost-pass"
                            className="text-gray-600 hover:text-black transition-colors"
                            onClick={() => onClose()}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="button"
                        className="w-full bg-black hover:bg-gray-800"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            href="/join"
                            className="font-semibold text-black hover:underline"
                            onClick={() => onClose()}
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
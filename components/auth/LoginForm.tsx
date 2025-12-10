"use client";
import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { setUser } from '@/lib/auth';
// import { useRouter } from 'next/router';

const LoginForm = () => {
  const { login, user } = useUser();
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // console.log('Current user in LoginForm:', user);
  // if (user) {
  //     return <></>;
  // }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
      login: '',
      password: '',
      rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
      if (error) setError('');
  };

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
              // Save user to cookies
              if (response.user) {
                  await setUser(response.user);
              }
              setFormData({ login: '', password: '', rememberMe: false });
              // router.push('/account');
              window.location.href = '/account';
          } else {
              setError(response.error || 'Login failed');
          }
      } catch (err: any) {
          setError(err.message || 'An error occurred during login');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dialog-login">Email or Username</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="dialog-login"
              name="login"
              type="text"
              // placeholder="john@example.com or johndoe"
              value={formData.login}
              onChange={handleChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="dialog-password">Password</Label>
            <Link
              href="/lost-pass"
              className="text-xs text-gray-600 hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="dialog-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              // placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              style={{ letterSpacing: '2pt' }}
              disabled={isLoading}
              required
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
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
        </div>
        {/* <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="dialog-rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                disabled={isLoading}
            />
            <Label htmlFor="dialog-rememberMe" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
            </Label>
        </div> */}
        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In...
            </>
          ) : (
            'Login'
          )}
        </Button>
        <div className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{' '}
          <Link
            href="/join"
            className="font-semibold text-black hover:underline"
          >
            Create an account
          </Link>
        </div>
      </form>
    </>
  );
};

export default LoginForm;

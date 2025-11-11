'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  error: string;
  passwordRequirements: { met: boolean; text: string }[];
  doPasswordsMatch: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
}

export default function RegisterForm({
  formData,
  showPassword,
  showConfirmPassword,
  isLoading,
  error,
  passwordRequirements,
  doPasswordsMatch,
  handleChange,
  handleSubmit,
  toggleShowPassword,
  toggleShowConfirmPassword,
}: RegisterFormProps) {
  return (
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
              onClick={toggleShowPassword}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </Button>
          </div>

          {formData.password && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {req.met ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-gray-300" />}
                  <span className={req.met ? 'text-green-600' : 'text-gray-400'}>{req.text}</span>
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
              type={showConfirmPassword ? 'text' : 'password'}
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
              onClick={toggleShowConfirmPassword}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </Button>
          </div>
          {formData.confirmPassword && !doPasswordsMatch && <p className="text-sm text-red-600">Passwords do not match</p>}
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
            <Link href="/terms" className="text-black hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-black hover:underline">Privacy Policy</Link>
          </Label>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
          disabled={isLoading || !formData.termsAccepted || !doPasswordsMatch}
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
          <Link href="/login" className="font-semibold text-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

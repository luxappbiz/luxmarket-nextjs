'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tokenStorage } from '@/lib/api';
import RegisterForm from '../form/RegisterForm';
import MemberBenefits from './MemberBenefits';
import { useUser } from '@/contexts/UserContext';

export default function JoinContainer() {
  const { login } = useUser(); // add this
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
    { met: /[!@#$%^&*]/.test(formData.password), text: 'One special character' },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.termsAccepted) return setError('Please accept the terms and conditions');
    if (!isPasswordValid) return setError('Password does not meet requirements');
    if (!doPasswordsMatch) return setError('Passwords do not match');

    setIsLoading(true);
    try {
      const response = await authApi.register(formData.email, formData.password);
      if (response.success) {
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);

        // ⚡ Update context so user is logged in immediately
        login(response.token, response.user, true, response.application_password);

        router.push('/account');
      } else setError(response.error || 'Registration failed');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden md:flex">
          <RegisterForm
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            error={error}
            passwordRequirements={passwordRequirements}
            doPasswordsMatch={doPasswordsMatch}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            toggleShowPassword={() => setShowPassword(prev => !prev)}
            toggleShowConfirmPassword={() => setShowConfirmPassword(prev => !prev)}
          />
          <MemberBenefits/>
        </div>
      </div>
    </div>
  );
}

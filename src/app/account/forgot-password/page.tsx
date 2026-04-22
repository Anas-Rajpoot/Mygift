'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to send reset email');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
            <Mail className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-light text-[var(--cream)]">Check your email</h1>
          <p className="mt-2 text-[var(--muted)]">
            If an account exists with that email, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/account/login">
            <Button className="mt-8" variant="outline">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-light text-[var(--cream)]">Reset Password</h1>
        <p className="mt-2 text-[var(--muted)]">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          type="email"
          placeholder="Email address"
          {...register('email')}
          error={errors.email?.message}
        />

        {error && (
          <div className="border border-[var(--rose)]/30 bg-[var(--rose)]/10 p-3 text-sm text-[var(--rose)]">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        Remember your password?{' '}
        <Link href="/account/login" className="text-[var(--gold)] underline hover:text-[var(--gold-light)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

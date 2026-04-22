'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      try {
        const loginResponse = await login(data.email, data.password);
        setUser(
          {
            id: result.id,
            email: data.email,
            displayName: `${data.firstName} ${data.lastName}`,
            firstName: data.firstName,
            lastName: data.lastName,
          },
          loginResponse.token
        );
        router.push(redirect);
      } catch {
        router.push('/account/login?registered=true');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <div className="text-center">
        <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
          Join Us
        </span>
        <h1 className="mt-3 font-heading text-4xl font-light text-[var(--cream)]">Create Account</h1>
        <p className="mt-2 text-[var(--muted)]">
          Start shopping today.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="First name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            placeholder="Last name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          type="email"
          placeholder="Email address"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          type="password"
          placeholder="Confirm password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <div className="border border-[var(--rose)]/30 bg-[var(--rose)]/10 p-3 text-sm text-[var(--rose)]">
            {error}
          </div>
        )}

        <div className="text-xs text-[var(--muted)]">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-[var(--gold)] underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="text-[var(--gold)] underline">
            Privacy Policy
          </Link>
          .
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        Already have an account?{' '}
        <Link
          href={`/account/login${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
          className="text-[var(--gold)] underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-[var(--surface-2)] mx-auto mb-4"></div>
            <div className="h-4 w-56 bg-[var(--surface-2)] mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 bg-[var(--surface-2)]"></div>
                <div className="h-12 bg-[var(--surface-2)]"></div>
              </div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
            </div>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

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

const loginSchema = z.object({
  username: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login(data.username, data.password);

      setUser(
        {
          id: 0,
          email: response.user_email,
          displayName: response.user_display_name,
          firstName: response.user_nicename,
        },
        response.token
      );

      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <div className="text-center">
        <span className="font-accent text-[10px] uppercase tracking-[0.5em] text-[var(--gold)]">
          Welcome Back
        </span>
        <h1 className="mt-3 font-heading text-4xl font-light text-[var(--cream)]">Sign In</h1>
        <p className="mt-2 text-[var(--muted)]">
          Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input
          type="text"
          placeholder="Email or username"
          {...register('username')}
          error={errors.username?.message}
        />

        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          error={errors.password?.message}
        />

        {error && (
          <div className="border border-[var(--rose)]/30 bg-[var(--rose)]/10 p-3 text-sm text-[var(--rose)]">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 border-[var(--border)] bg-transparent text-[var(--gold)] focus:ring-[var(--gold)] focus:ring-offset-[var(--ink)]"
            />
            <span className="text-sm text-[var(--cream)]">Remember me</span>
          </label>
          <Link
            href="/account/forgot-password"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        Don&apos;t have an account?{' '}
        <Link
          href={`/account/register${redirect !== '/account' ? `?redirect=${redirect}` : ''}`}
          className="text-[var(--gold)] underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-[var(--surface-2)] mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-[var(--surface-2)] mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-[var(--surface-2)]"></div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
              <div className="h-12 bg-[var(--surface-2)]"></div>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

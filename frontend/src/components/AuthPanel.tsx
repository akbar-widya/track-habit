import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { authClient } from '../lib/auth-client';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

type AuthMode = 'signin' | 'signup';

export default function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-semibold tracking-tight">
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-muted">
          {mode === 'signin'
            ? 'Sign in to keep your streak alive.'
            : 'Start building your routine today.'}
        </p>
      </div>

      <GoogleButton />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted uppercase tracking-wider">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email/password form — keyed by mode so the form resets on switch */}
      <AuthForm key={mode} mode={mode} onSwitchMode={setMode} />
    </div>
  );
}

function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      if (error) {
        setError(error.message ?? 'Failed to start Google sign-in');
        setIsLoading(false);
      }
    } catch {
      setError('Failed to start Google sign-in');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground bg-surface-elevated hover:bg-border/50 border border-border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>
      {error && (
        <p className="text-[13px] text-[#FFB4AB] bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 rounded px-3 py-2 -mt-3">
          {error}
        </p>
      )}
    </>
  );
}

interface AuthFormProps {
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
}

function AuthForm({ mode, onSwitchMode }: AuthFormProps) {
  const isSignUp = mode === 'signup';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(
      isSignUp ? signUpSchema : signInSchema,
    ) as unknown as Resolver<SignUpFormData>,
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      : await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

    if (error) {
      setSubmitError(error.message ?? 'Something went wrong');
      setIsSubmitting(false);
      return;
    }

    // Session hook in App picks up the new session and swaps the view.
    setIsSubmitting(false);
  };

  const inputClass =
    'bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors';
  const labelClass =
    'text-[11px] font-semibold text-muted uppercase tracking-wider';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {isSignUp && (
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Name</label>
          <input
            {...register('name')}
            placeholder="Your name"
            className={inputClass}
            autoFocus
          />
          {errors.name && (
            <span className="text-[12px] text-[#FFB4AB]">
              {errors.name.message}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className={inputClass}
          autoFocus={!isSignUp}
        />
        {errors.email && (
          <span className="text-[12px] text-[#FFB4AB]">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Password</label>
        <input
          {...register('password')}
          type="password"
          placeholder={
            isSignUp ? 'At least 8 characters' : '••••••••'
          }
          className={inputClass}
        />
        {errors.password && (
          <span className="text-[12px] text-[#FFB4AB]">
            {errors.password.message}
          </span>
        )}
      </div>

      {submitError && (
        <p className="text-[13px] text-[#FFB4AB] bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 rounded px-3 py-2">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 text-sm font-medium text-foreground bg-primary hover:bg-primary-hover rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? 'Please wait...'
          : isSignUp
            ? 'Sign Up'
            : 'Sign In'}
      </button>

      <p className="text-[13px] text-muted text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => onSwitchMode(isSignUp ? 'signin' : 'signup')}
          className="text-primary font-medium hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </form>
  );
}

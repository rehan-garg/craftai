import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Sparkles,
} from 'lucide-react';

import { login } from '../../services/authService';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear the error as soon as the user starts correcting the form.
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = login(
        formData.email.trim(),
        formData.password
      );

      if (!result.success) {
        setError(
          result.message || 'Invalid email or password.'
        );
        return;
      }

      const role = result.user?.role?.toLowerCase();

      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error('Login failed:', err);

      setError(
        'Something went wrong while signing you in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-stone-800">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — BRAND EXPERIENCE */}

        <section className="relative hidden overflow-hidden bg-[#2f241d] lg:flex">
          {/* Decorative background elements */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}

            <Link
              to="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-900/20">
                <Sparkles className="h-5 w-5" />
              </div>

              <span className="text-xl font-semibold tracking-tight text-white">
                Craft<span className="text-amber-400">AI</span>
              </span>
            </Link>

            {/* Main message */}

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                Artisan Intelligence
              </p>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Turn your craft
                <span className="block text-amber-400">
                  into a business.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-stone-300">
                CraftAI helps artisans understand their products,
                discover their market value, and create compelling
                listings in seconds.
              </p>

              {/* Feature cards */}

              <div className="mt-10 grid gap-3">
                {[
                  ['01', 'AI-powered product analysis'],
                  ['02', 'Intelligent pricing insights'],
                  ['03', 'Marketplace-ready listings'],
                ].map(([number, text]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="text-xs font-semibold text-amber-400">
                      {number}
                    </span>

                    <span className="text-sm text-stone-200">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-stone-500">
              Built for artisans. Powered by intelligence.
            </p>
          </div>
        </section>

        {/* RIGHT — LOGIN */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}

            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <span className="text-xl font-semibold">
                  Craft<span className="text-amber-600">AI</span>
                </span>
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-amber-700">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Sign in to CraftAI
              </h2>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Continue creating, analyzing and growing your
                craft business.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:bg-stone-100"
                />
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-amber-700 transition hover:text-amber-800"
                    onClick={() => {
                      setError(
                        'Please contact support to reset your password.'
                      );
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 pr-12 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:bg-stone-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}

              {error ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              ) : null}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* SIGNUP */}

            <div className="mt-8 text-center text-sm text-stone-500">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-amber-700 transition hover:text-amber-800"
              >
                Create one
              </Link>
            </div>

            {/* FOOTER */}

            <div className="mt-10 border-t border-stone-200 pt-5 text-center">
              <p className="text-xs text-stone-400">
                By continuing, you agree to CraftAI's terms and
                privacy policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
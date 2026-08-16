import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  Sparkles,
  Store,
  ShoppingBag,
} from 'lucide-react';

import { signup } from '../../services/authService';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Seller',
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
      const result = signup(formData);

      if (!result.success) {
        setError(result.message || 'Unable to sign up.');
        return;
      }

      const role = formData.role?.toLowerCase();

      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error('Signup failed:', err);

      setError(
        'Something went wrong while creating your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-stone-800">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT — BRAND PANEL */}

        <section className="relative hidden overflow-hidden bg-[#2f241d] lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

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

            {/* CONTENT */}

            <div className="max-w-lg">

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                Your Craft. Your Marketplace.
              </p>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Build your
                <span className="block text-amber-400">
                  craft business.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-stone-300">
                Join CraftAI and turn your handmade products into
                professional, market-ready listings with the help
                of AI.
              </p>

              {/* BENEFITS */}

              <div className="mt-10 space-y-3">

                {[
                  'Understand what makes your product valuable',
                  'Generate marketplace-ready product listings',
                  'Reach customers who value handmade products',
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm text-stone-300">
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

        {/* RIGHT — SIGNUP */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

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

            {/* HEADING */}

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-amber-700">
                Get started
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Join CraftAI and start turning your craft into a
                market-ready business.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:bg-stone-100"
                />
              </div>

              {/* EMAIL */}

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

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
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

                <p className="mt-2 text-xs text-stone-400">
                  Use a password you don't use elsewhere.
                </p>
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  I want to join as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* SELLER */}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        role: 'Seller',
                      }))
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      formData.role === 'Seller'
                        ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/10'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                        formData.role === 'Seller'
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Store className="h-4 w-4" />
                    </div>

                    <p className="text-sm font-semibold text-stone-800">
                      Seller
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Create and grow your craft business.
                    </p>
                  </button>

                  {/* BUYER */}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        role: 'Buyer',
                      }))
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      formData.role === 'Buyer'
                        ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/10'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                        formData.role === 'Buyer'
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </div>

                    <p className="text-sm font-semibold text-stone-800">
                      Buyer
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Discover unique handmade products.
                    </p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* LOGIN */}

            <div className="mt-8 text-center text-sm text-stone-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-amber-700 transition hover:text-amber-800"
              >
                Sign in
              </Link>
            </div>

            {/* FOOTER */}

            <div className="mt-8 border-t border-stone-200 pt-5 text-center">
              <p className="text-xs text-stone-400">
                By creating an account, you agree to CraftAI's
                terms and privacy policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signup;
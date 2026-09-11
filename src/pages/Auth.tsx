import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useMarketplace } from '../context/MarketplaceContext';
import { Apple, Mail, ArrowLeft, Lock, User, Smartphone } from 'lucide-react';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useMarketplace();

  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'select';
  const redirectTarget = searchParams.get('redirect');
  const productIdParam = searchParams.get('productId');

  const [view, setView] = useState<'select' | 'email_signup' | 'login' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // REDIRECT RESTORATION ROUTER
  const handlePostAuthRedirect = () => {
    if (redirectTarget === 'sell') {
      navigate('/sell');
    } else if (redirectTarget === 'checkout' && productIdParam) {
      navigate(`/checkout/${productIdParam}`);
    } else if (redirectTarget === 'product' && productIdParam) {
      navigate(`/product/${productIdParam}`);
    } else {
      navigate('/');
    }
  };

  const handleSocialAuth = (provider: string) => {
    showToast(`${provider} Sign In`, `Connected successfully with ${provider}.`, 'success');
    setTimeout(() => {
      handlePostAuthRedirect();
    }, 400);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'email_signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              surname: surname.trim(),
              phone: phone.trim(),
            },
          },
        });
        if (error) throw error;
        showToast('Account Created! 🎉', 'Welcome to Kinne Ho? (0% seller fees).', 'success');
        handlePostAuthRedirect();
      } else if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Welcome back 👋', 'Signed in successfully.', 'success');
        handlePostAuthRedirect();
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=login`,
        });
        if (error) throw error;
        showToast('Reset Link Sent ✉️', 'Please check your email inbox.', 'info');
        setView('login');
      }
    } catch (err: any) {
      showToast('Notice', err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 max-w-md mx-auto space-y-6">
      
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {view === 'select' && 'Join and sell pre-loved pieces with no fees'}
            {view === 'email_signup' && 'Sign up with email'}
            {view === 'login' && 'Log in to Kinne Ho?'}
            {view === 'forgot' && 'Reset your password'}
          </h1>
          <p className="text-xs text-gray-500">
            {view === 'select' && 'Sign in to buy with Escrow protection or list items for free.'}
          </p>
        </div>

        {/* 1. SELECT SOCIAL PROVIDERS */}
        {view === 'select' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('Apple')}
              className="w-full flex items-center justify-center gap-3 border border-gray-900 bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Apple className="w-5 h-5 fill-current" />
              <span>Continue with Apple</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('Facebook')}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>

            <div className="pt-4 text-center space-y-2 text-xs">
              <p className="text-gray-600">
                Or register with{' '}
                <button
                  onClick={() => setView('email_signup')}
                  className="font-bold text-[#1b7a53] hover:underline cursor-pointer"
                >
                  email
                </button>
              </p>

              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="font-bold text-[#1b7a53] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Are you a business?{' '}
              <Link to="/how-it-works" className="text-[#1b7a53] hover:underline font-bold">
                Learn more
              </Link>
              .
            </div>
          </div>
        )}

        {/* 2. EMAIL SIGN UP / LOGIN / FORGOT FORM */}
        {view !== 'select' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <button
              type="button"
              onClick={() => setView('select')}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all options</span>
            </button>

            {view === 'email_signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Surname</label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>

            {view !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] text-[#1b7a53] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'Please wait...'
                : view === 'email_signup'
                ? 'Create Account'
                : view === 'login'
                ? 'Log in'
                : 'Send Reset Link'}
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
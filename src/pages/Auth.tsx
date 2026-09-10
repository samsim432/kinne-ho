import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useMarketplace } from '../context/MarketplaceContext';
import { Lock, Mail, ArrowRight, Smartphone, MapPin, KeyRound, ArrowLeft } from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useMarketplace();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              surname: surname.trim(),
              phone: phone.trim(),
              delivery_address: deliveryAddress.trim(),
            },
          },
        });

        if (error) throw error;
        showToast('Account Created! 🎉', 'Welcome to Kinne Ho? Please check your email if verification is required.', 'success');
        navigate('/');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        showToast('Welcome back! 👋', 'Signed in successfully.', 'success');
        navigate('/');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });

        if (error) throw error;
        showToast('Reset Link Sent! ✉️', 'Check your email inbox for the password reset link.', 'info');
        setMode('signin');
      }
    } catch (err: any) {
      showToast('Authentication Notice', err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-md mx-auto space-y-6">
      
      {/* Title & Description */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {mode === 'signup' && 'Join Kinne Ho?'}
          {mode === 'signin' && 'Welcome Back'}
          {mode === 'forgot' && 'Reset Your Password'}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'signup' && 'Buy and sell second-hand goods across Nepal with escrow safety.'}
          {mode === 'signin' && 'Sign in to access your wallet, deals, and active listings.'}
          {mode === 'forgot' && 'Enter your registered email to receive a secure password recovery link.'}
        </p>
      </div>

      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
        
        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign Up Specific Fields */}
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Samir"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Surname</label>
                  <input
                    type="text"
                    required
                    placeholder="Simkhada"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nepal Mobile Number</label>
                <div className="relative flex items-center">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Default Delivery Area / Chowk</label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="e.g. New Baneshwor, Kathmandu"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email field (all modes) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          {/* Password field (Sign In & Sign Up) */}
          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-[#1b7a53] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {mode === 'forgot' && <KeyRound className="w-4 h-4" />}
            <span>
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                ? 'Create My Account'
                : mode === 'signin'
                ? 'Sign In'
                : 'Send Recovery Email'}
            </span>
            {mode !== 'forgot' && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        {mode !== 'forgot' && (
          <div className="pt-2 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-xs font-bold text-[#1b7a53] hover:underline cursor-pointer"
            >
              {mode === 'signup'
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
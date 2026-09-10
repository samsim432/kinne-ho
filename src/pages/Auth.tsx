import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Phone, ArrowRight, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign Up Fields
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification Step
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'signup') {
      setTimeout(() => {
        setIsLoading(false);
        setIsVerifying(true); // Open Email Verification Screen
      }, 700);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 700);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="py-8 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-9 shadow-card space-y-6">
        
        {/* Brand Badge */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b7a53]/10 text-[#1b7a53] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kinne Ho? Secure Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isVerifying 
              ? 'Verify Your Email' 
              : mode === 'signin' 
                ? 'Welcome back' 
                : 'Create your account'}
          </h1>

          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {isVerifying
              ? `We sent a 6-digit confirmation code to ${email}.`
              : mode === 'signin'
                ? 'Sign in to access your wallet, listings, and messages.'
                : 'Join Nepal’s trusted peer-to-peer marketplace.'}
          </p>
        </div>

        {isVerifying ? (
          /* Verification OTP Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block text-center uppercase tracking-wider">
                Enter Verification Code
              </label>
              <div className="relative flex items-center max-w-xs mx-auto">
                <KeyRound className="absolute left-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-center text-xl tracking-widest font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1b7a53]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify & Enter Marketplace'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-gray-400">
              Didn't receive email?{' '}
              <button type="button" onClick={() => alert('Code resent!')} className="text-[#1b7a53] font-semibold hover:underline">
                Resend Code
              </button>
            </p>
          </form>
        ) : (
          <>
            {/* Mode Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  {/* First Name & Surname */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">First Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Samir"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">Surname</label>
                      <input
                        type="text"
                        placeholder="Simkhada"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Delivery Address (City / Area)</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. New Baneshwor, Kathmandu"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 block">Phone Number</label>
                      <span className="text-[10px] text-gray-400 font-medium">Optional</span>
                    </div>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="wrongsamir88@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 block">Password</label>
                  {mode === 'signin' && (
                    <a href="#forgot" className="text-[11px] text-[#1b7a53] hover:underline font-medium">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center text-[11px] text-gray-400 pt-2 border-t border-gray-100">
              By continuing, you agree to Kinne Ho?'s{' '}
              <Link to="/safety" className="text-gray-600 underline">Escrow & Safety Rules</Link>.
            </div>
          </>
        )}

      </div>
    </div>
  );
};
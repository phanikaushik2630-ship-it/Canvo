import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ConvoLogo } from '../common/ConvoLogo';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Hash,
  RefreshCw,
  Inbox
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register, 
    sendResetOtp, 
    verifyResetOtp 
  } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password OTP states
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your business email address');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await sendResetOtp(email.trim());
      setSimulatedOtp(res.simulatedOtp || '123456');
      setOtpStep('verify');
      setSuccessMsg(res.message || `A 6-digit OTP has been sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit verification code from your email');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await verifyResetOtp(email.trim(), otpCode.trim(), newPassword);
      setSuccessMsg('Password verified & updated! You are now logged in.');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else if (authModalMode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await login('demo@canvo.app', 'demo123');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setAuthModalMode('login');
    setOtpStep('request');
    setError(null);
    setSuccessMsg(null);
    setOtpCode('');
    setSimulatedOtp(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-artisan-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-warm-xl border border-artisan-200 animate-scale-in relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-artisan-100 text-artisan-400 hover:text-artisan-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-1">
            <ConvoLogo size="lg" showWordmark={false} showTagline={false} />
          </div>
          <h3 className="font-serif font-bold text-2xl text-artisan-950">
            {authModalMode === 'login'
              ? 'Welcome Back to Canvo'
              : authModalMode === 'register'
              ? 'Create Your Business Bot'
              : otpStep === 'request'
              ? 'Reset Owner Password'
              : 'Enter Email OTP Code'}
          </h3>
          <p className="text-xs text-artisan-500">
            {authModalMode === 'login'
              ? 'Sign in to access your business chatbot dashboard & orders'
              : authModalMode === 'register'
              ? 'Join Canvo to deploy an AI concierge for your local business'
              : otpStep === 'request'
              ? 'We will send a 6-digit OTP verification code to your email'
              : `Enter the 6-digit code dispatched to ${email} and choose a new password`}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {authModalMode !== 'forgot_password' ? (
          <div className="flex bg-artisan-100/80 p-1 rounded-2xl border border-artisan-200 mb-5">
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-artisan-950 shadow-warm-sm font-bold'
                  : 'text-artisan-600 hover:text-artisan-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-artisan-950 shadow-warm-sm font-bold'
                  : 'text-artisan-600 hover:text-artisan-900'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-2xl border border-amber-200 mb-5 text-xs text-amber-900">
            <span className="font-medium flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>{otpStep === 'request' ? 'Step 1 of 2: Email Verification' : 'Step 2 of 2: Verify & Reset'}</span>
            </span>
            <button
              type="button"
              onClick={resetToLogin}
              className="text-terracotta-700 hover:underline font-bold text-[11px]"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium animate-shake">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Simulated Mailbox Preview Banner (for local dev / demo testing convenience) */}
        {authModalMode === 'forgot_password' && otpStep === 'verify' && simulatedOtp && (
          <div className="p-3 mb-4 rounded-2xl bg-artisan-100/90 border border-terracotta-200/80 text-xs space-y-1 shadow-warm-sm">
            <div className="flex items-center justify-between font-bold text-artisan-900">
              <span className="flex items-center gap-1.5 text-terracotta-700">
                <Inbox className="w-4 h-4 text-terracotta-600" />
                Demo Mailbox Simulator
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-terracotta-100 text-terracotta-800 px-2 py-0.5 rounded-full font-mono">
                10 min expiry
              </span>
            </div>
            <p className="text-[11px] text-artisan-600">
              Your 6-digit OTP code is: <strong className="text-terracotta-700 font-mono text-sm tracking-widest bg-white px-2 py-0.5 rounded-md border border-artisan-200">{simulatedOtp}</strong>
            </p>
          </div>
        )}

        {/* --- FORGOT PASSWORD FLOW --- */}
        {authModalMode === 'forgot_password' ? (
          otpStep === 'request' ? (
            /* STEP 1: Request OTP */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Registered Business Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-artisan pl-9.5 text-xs sm:text-sm"
                    placeholder="owner@yourbusiness.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3 text-xs sm:text-sm shadow-warm-md"
              >
                <span>{loading ? 'Dispatching OTP Code...' : 'Send 6-Digit OTP to Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP & New Password */
            <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpStep('request')}
                    className="text-[11px] text-artisan-500 hover:text-terracotta-700 underline"
                  >
                    Change Email
                  </button>
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="input-artisan pl-9.5 text-center font-mono font-bold tracking-widest text-base sm:text-lg"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-artisan pl-9.5 text-xs sm:text-sm"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-artisan pl-9.5 text-xs sm:text-sm"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3 text-xs sm:text-sm shadow-warm-md"
              >
                <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Reset Password'}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-xs font-semibold text-artisan-500 hover:text-terracotta-700 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP Code</span>
                </button>
              </div>
            </form>
          )
        ) : (
          /* --- LOGIN / REGISTER FORM --- */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-artisan pl-9.5 text-xs sm:text-sm"
                    placeholder="e.g. Claire Dupont"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider mb-1">
                Business Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-artisan pl-9.5 text-xs sm:text-sm"
                  placeholder="owner@yourbusiness.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-artisan-700 uppercase tracking-wider">
                  Password
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { 
                      setAuthModalMode('forgot_password'); 
                      setOtpStep('request');
                      setError(null); 
                      setSuccessMsg(null); 
                    }}
                    className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-artisan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-artisan pl-9.5 text-xs sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-xs sm:text-sm mt-2 shadow-warm-md"
            >
              <span>{loading ? 'Authenticating...' : authModalMode === 'login' ? 'Sign In to Dashboard' : 'Register & Create Bot'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* 1-Click Demo Owner Button */}
        {authModalMode !== 'forgot_password' && (
          <div className="mt-5 pt-5 border-t border-artisan-200/80 text-center space-y-2">
            <p className="text-[11px] text-artisan-500 font-medium">
              Just exploring? Test with the pre-seeded bakery owner account:
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-all shadow-warm-sm"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Demo Owner Login (demo@canvo.app)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

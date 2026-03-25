import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Phone, Lock, ShieldCheck, ChevronRight, TreePine, Sprout, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { dbService } from '../services/dbService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<string | true>;
  onSignUp: (email: string, pass: string, name: string, language: string) => Promise<string | true>;
  onGoogleLogin: () => Promise<void>;
  onLoginSuccess: (user: any) => void;
}

type LoginMethod = 'email' | 'phone';
type AuthStep = 'input' | 'otp';

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp, onGoogleLogin, onLoginSuccess }) => {
  const [method, setMethod] = useState<LoginMethod>('email');
  const [step, setStep] = useState<AuthStep>('input');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    dbService.setupRecaptcha('recaptcha-container');
  }, []);

  const handleSendOTP = async () => {
    setError('');
    setSuccessMessage('');
    const identifier = method === 'email' ? email : phoneNumber;
    if (!identifier) {
      setError(`Please enter your ${method === 'email' ? 'email address' : 'phone number'}.`);
      return;
    }

    setIsLoading(true);
    try {
      if (method === 'email') {
        const data = await dbService.sendEmailOTP(email);
        if (data.previewUrl) {
          setEmailPreviewUrl(data.previewUrl);
        }
      } else {
        await dbService.sendPhoneOTP(phoneNumber);
      }
      setStep('otp');
      setSuccessMessage(`OTP sent to your ${method === 'email' ? 'email' : 'phone'}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const identifier = method === 'email' ? email : phoneNumber;
      const user = await dbService.verifyOTP(otp, identifier, method);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again (Hint: 123456).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await onLogin(email, password);
    if (result !== true) {
      setError(result);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 font-sans">
      {/* Nature Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 text-emerald-600"
        >
          <TreePine size={200} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 text-green-600"
        >
          <Sprout size={300} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div id="recaptcha-container"></div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100/50 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-4 text-center">
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 text-emerald-600"
            >
              <Leaf size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">EcoChamps</h1>
            <p className="text-emerald-700 font-medium italic">
              "Learn, Play, and Protect the Environment!"
            </p>
          </div>

          {/* Tabs */}
          <div className="flex px-8 gap-4 mb-6">
            <button 
              onClick={() => { setMethod('email'); setStep('input'); setError(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                method === 'email' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              )}
            >
              <Mail size={16} /> Email
            </button>
            <button 
              onClick={() => { setMethod('phone'); setStep('input'); setError(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                method === 'phone' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              )}
            >
              <Phone size={16} /> Phone
            </button>
          </div>

          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {step === 'input' ? (
                <motion.div
                  key="input-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {method === 'email' ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nature@lover.com"
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-emerald-900 placeholder:text-emerald-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-emerald-900 placeholder:text-emerald-300"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-emerald-900 placeholder:text-emerald-300"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-3 pt-2">
                    {method === 'email' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleSendOTP}
                          disabled={isLoading}
                          className="py-3 px-4 bg-emerald-100 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isLoading ? "..." : "Send OTP"}
                        </button>
                        <button 
                          onClick={handleLogin}
                          disabled={isLoading}
                          className="py-3 px-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
                        >
                          {isLoading ? "..." : "Login"} <ChevronRight size={18} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
                      >
                        {isLoading ? "Sending..." : "Send OTP"} <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => setStep('input')}
                    className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline mb-2"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider ml-1">Enter OTP</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-emerald-900 placeholder:text-emerald-300 tracking-[0.5em] font-bold text-center"
                      />
                    </div>
                  </div>

                  {successMessage && (
                    <div className="space-y-2">
                      <p className="text-emerald-600 text-xs font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        {successMessage}
                      </p>
                      {emailPreviewUrl && (
                        <a 
                          href={emailPreviewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-center text-xs font-bold text-emerald-700 bg-emerald-100 py-2 rounded-xl hover:bg-emerald-200 transition-all border border-emerald-200"
                        >
                          View Sent Email (Ethereal) 📧
                        </a>
                      )}
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                      {error}
                    </p>
                  )}

                  <button 
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP & Login"} <ShieldCheck size={18} />
                  </button>

                  <p className="text-center text-xs text-emerald-600">
                    Didn't receive code? <button onClick={handleSendOTP} className="font-bold hover:underline">Resend</button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <button className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Forgot Password?
                </button>
                <button className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                  Sign Up / Register
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-2 bg-white text-emerald-400">Or connect with</span>
                </div>
              </div>

              <button 
                onClick={onGoogleLogin}
                className="w-full py-3 px-4 bg-white border-2 border-emerald-50 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-emerald-600/60 text-sm font-medium">
          &copy; 2026 EcoChamps. All rights reserved.
        </p>
      </motion.div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;

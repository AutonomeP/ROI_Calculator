import { useState, FormEvent } from 'react';
import { Mail, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../contexts/ThemeContext';

export default function EmailGateModal() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) {
        setError('Unable to send verification email. Please try again.');
        console.error('Auth error:', authError);
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
      <div className={`absolute inset-0 backdrop-blur-md ${theme === 'dark' ? 'bg-premium-gradient' : 'bg-premium-gradient-light'}`}>
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-glow opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-glow opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className={`relative z-10 max-w-md w-full p-10 md:p-12 rounded-3xl glass-card ${theme === 'dark' ? 'shadow-premium' : 'shadow-premium-light'} animate-scaleIn`}>
        {!emailSent ? (
          <>
            <div className="flex justify-center mb-8 fade-in stagger-1">
              <div className="metric-card-orange p-6 relative overflow-visible group">
                <div className="absolute inset-0 bg-orange-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
                <Mail size={48} className="text-roi-orange relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center mb-10 fade-in stagger-2">
              <h2 className={`text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Access ROI Calculator
              </h2>
              <p className={`text-base leading-relaxed max-w-sm mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Enter your email to receive a secure access link. Once verified, you can return on this device without re-verifying.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 fade-in stagger-3">
              <div>
                <label className={`block text-[10px] uppercase tracking-[0.15em] font-bold mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-secondary/60'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="glass-input w-full px-5 py-4 text-base font-medium"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className={`glass-card p-4 border-2 ${theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-500/30 bg-red-500/5'} animate-shake`}>
                  <p className="text-sm text-red-500 font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full rounded-xl bg-roi-orange px-8 py-4 text-base font-bold uppercase tracking-wider text-white hover:bg-roi-orange/90 transition-all duration-300 shadow-lg hover:shadow-orange-glow hover:scale-[1.02] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Sending...' : 'Send Access Link'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-roi-orange to-roi-orange-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className={`flex items-center justify-center gap-2 mt-8 fade-in stagger-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              <Shield size={14} strokeWidth={2} />
              <p className="text-xs font-medium">
                Secure verification • No spam, ever
              </p>
            </div>
          </>
        ) : (
          <div className="fade-in">
            <div className="flex justify-center mb-8 fade-in stagger-1">
              <div className={`metric-card p-6 relative overflow-visible ${theme === 'dark' ? 'bg-green-500/20 border-green-500/50' : 'bg-green-500/10 border-green-500/30'}`}>
                <div className={`absolute inset-0 blur-2xl opacity-50 ${theme === 'dark' ? 'bg-green-500/30' : 'bg-green-500/20'}`}></div>
                <CheckCircle size={48} className="text-green-500 relative z-10 animate-scaleIn" strokeWidth={2} />
              </div>
            </div>

            <div className="text-center fade-in stagger-2">
              <h2 className={`text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Check Your Email
              </h2>
              <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                We've sent a verification link to:
              </p>

              <div className={`glass-card p-5 mb-6 border-2 ${theme === 'dark' ? 'border-roi-orange/30' : 'border-roi-orange/20'}`}>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                  {email}
                </p>
              </div>

              <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Click the link in your email to access the calculator. This window will automatically update once you verify.
              </p>
            </div>

            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setError(null);
              }}
              className={`glass-card w-full mt-6 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'text-white hover:border-white/30'
                  : 'text-roi-text-primary hover:border-black/20'
              }`}
            >
              Use Different Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

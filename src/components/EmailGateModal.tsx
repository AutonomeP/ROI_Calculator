import { useState, FormEvent } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-md"></div>

      <div className={`relative z-10 max-w-md w-full p-8 md:p-10 rounded-3xl ${theme === 'dark' ? 'bg-roi-black/98 border border-white/20' : 'bg-white border border-black/10'} shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}>
        {!emailSent ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-roi-orange/10 rounded-2xl">
                <Mail size={40} className="text-roi-orange" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className={`text-3xl font-black mb-3 leading-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Access ROI Calculator
              </h2>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Enter your email to receive a secure access link. Once verified, you can return on this device without re-verifying.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-roi-orange ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border border-black/10 text-roi-text-primary placeholder-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full rounded-xl bg-roi-orange px-6 py-3.5 text-sm font-bold text-white hover:bg-roi-orange/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Access Link'}
              </button>
            </form>

            <p className={`text-xs text-center mt-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              By continuing, you agree to receive a one-time email verification link.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/10 rounded-2xl">
                <CheckCircle size={40} className="text-green-500" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center">
              <h2 className={`text-3xl font-black mb-3 leading-tight ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                Check Your Email
              </h2>
              <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                We've sent a verification link to:
              </p>
              <p className={`text-base font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                {email}
              </p>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Click the link in your email to access the calculator. This window will automatically update once you verify.
              </p>
            </div>

            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setError(null);
              }}
              className={`w-full mt-6 rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  : 'bg-gray-100 text-roi-text-primary hover:bg-gray-200'
              }`}
            >
              Use Different Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

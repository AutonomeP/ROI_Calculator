/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'roi-black': '#0B1120',
        'roi-charcoal': '#161E30',
        'roi-grey': '#1E293B',
        'roi-orange': '#0052FF',
        'roi-orange-glow': '#FDC500',
        'autonome-blue': '#0052FF',
        'autonome-blue-deep': '#003AC2',
        'autonome-yellow': '#FDC500',
        'autonome-yellow-soft': '#FEF9C3',
        'roi-light-bg': '#F8FAFC',
        'roi-light-card': '#FFFFFF',
        'roi-text-primary': '#0F172A',
        'roi-text-secondary': '#334155',
        'roi-text-tertiary': '#64748B',
        'roi-placeholder': '#94A3B8',
        'roi-red': '#EF4444', // Kept for error states
        'autonome-navy': '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #0B1120 0%, #0F172A 55%, #161E30 100%)',
        'premium-gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 48%, #F1F5F9 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        'orange-glow': 'radial-gradient(circle at center, rgba(253,197,0,0.16) 0%, transparent 70%)',
        'orange-glow-light': 'radial-gradient(circle at center, rgba(0,82,255,0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 30px 70px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
        'premium-light': '0 10px 30px rgba(0, 82, 255, 0.04), 0 2px 8px rgba(0, 82, 255, 0.02)',
        'premium-light-hover': '0 20px 50px rgba(0, 82, 255, 0.08), 0 4px 16px rgba(0, 82, 255, 0.04)',
        'logo-glow': '0 0 30px rgba(0, 82, 255, 0.1), 0 10px 30px rgba(0,0,0,0.1)',
        'cta-glow': '0 10px 40px rgba(0, 82, 255, 0.25)',
        'cta-glow-hover': '0 15px 50px rgba(0, 82, 255, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float-premium': 'float-premium 8s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-premium': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
      },
    },
  },
  plugins: [],
};

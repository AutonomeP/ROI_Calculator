/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'roi-black': '#070707',
        'roi-charcoal': '#111111',
        'roi-grey': '#1A1A1A',
        'roi-orange': '#CC0000',
        'roi-orange-glow': '#FDC500',
        'roi-red': '#CC0000',
        'roi-red-deep': '#8F0000',
        'roi-yellow': '#FDC500',
        'roi-yellow-soft': '#FFF7CC',
        'roi-light-bg': '#F8F7F3',
        'roi-light-card': '#FFFFFF',
        'roi-text-primary': '#000000',
        'roi-text-secondary': '#3E3E3E',
        'roi-text-tertiary': '#747474',
        'roi-placeholder': '#8A8A8A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #050505 0%, #111111 55%, #1A0000 100%)',
        'premium-gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8F7F3 48%, #FFF0F0 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'orange-glow': 'radial-gradient(circle at center, rgba(253,197,0,0.16) 0%, transparent 70%)',
        'orange-glow-light': 'radial-gradient(circle at center, rgba(204,0,0,0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'premium-hover': '0 12px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
        'premium-light': '0px 2px 12px rgba(0, 0, 0, 0.06)',
        'premium-light-hover': '0px 4px 20px rgba(0, 0, 0, 0.10)',
        'orange-glow': '0 0 40px rgba(255, 60, 0, 0.3), 0 0 20px rgba(255, 60, 0, 0.2)',
        'orange-glow-lg': '0 0 60px rgba(255, 60, 0, 0.4), 0 0 30px rgba(255, 60, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

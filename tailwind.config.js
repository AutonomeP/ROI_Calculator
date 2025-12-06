/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'roi-black': '#0A0A0A',
        'roi-charcoal': '#161616',
        'roi-grey': '#1E1E1E',
        'roi-orange': '#FF3C00',
        'roi-orange-glow': '#FF6B3D',
        'roi-light-bg': '#F5F5F7',
        'roi-light-card': 'rgba(255, 255, 255, 0.55)',
        'roi-text-primary': '#000000',
        'roi-text-secondary': '#444444',
        'roi-text-tertiary': '#666666',
        'roi-placeholder': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #161616 50%, #0A0A0A 100%)',
        'premium-gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 50%, #FFFFFF 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'orange-glow': 'radial-gradient(circle at center, rgba(255,60,0,0.15) 0%, transparent 70%)',
        'orange-glow-light': 'radial-gradient(circle at center, rgba(255,60,0,0.08) 0%, transparent 70%)',
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

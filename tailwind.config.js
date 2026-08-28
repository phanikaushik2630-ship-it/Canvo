/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        editorial: ['Fraunces', 'serif'],
      },
      colors: {
        artisan: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E8DEC0',
          300: '#D9C8A8',
          400: '#C2AD85',
          500: '#A48E63',
          600: '#7F6B47',
          700: '#5E4E32',
          800: '#3D311F',
          900: '#231B10',
          950: '#140F08',
        },
        terracotta: {
          50: '#FDF6F2',
          100: '#FBEDE5',
          200: '#F5D7C7',
          300: '#EBB69F',
          400: '#DF8D6C',
          500: '#C9633A', // Primary accent
          600: '#B64E26',
          700: '#953B1C',
          800: '#793019',
          900: '#642A18',
          950: '#38130B',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E7EFE8',
          200: '#D0DFD2',
          300: '#AAC7AE',
          400: '#7DA984',
          500: '#598A61',
          600: '#466F4D',
          700: '#39573E',
          800: '#304634',
          900: '#293A2C',
          950: '#142017',
        },
        honey: {
          50: '#FEFAF0',
          100: '#FDF4DC',
          200: '#FBE6B4',
          300: '#F7D282',
          400: '#F2B94C',
          500: '#D49B37',
          600: '#B77C27',
          700: '#925B20',
          800: '#77471E',
          900: '#633A1C',
        },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(35, 27, 16, 0.06)',
        'warm-md': '0 8px 24px -4px rgba(35, 27, 16, 0.08), 0 2px 6px -1px rgba(35, 27, 16, 0.04)',
        'warm-lg': '0 16px 40px -8px rgba(35, 27, 16, 0.12), 0 4px 12px -2px rgba(35, 27, 16, 0.06)',
        'warm-xl': '0 24px 60px -12px rgba(35, 27, 16, 0.18), 0 8px 20px -4px rgba(35, 27, 16, 0.08)',
        'glow-terracotta': '0 0 25px -4px rgba(201, 99, 58, 0.4)',
        'glow-sage': '0 0 25px -4px rgba(89, 138, 97, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

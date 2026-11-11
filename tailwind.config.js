/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Bảng màu chính ──────────────────────────────
        cream:    { DEFAULT: '#F8F5EF', dark: '#EDE8DF' },
        beige:    { DEFAULT: '#E8DED0', dark: '#D6C9B6' },
        champ:    { DEFAULT: '#C7A878', light: '#D8BF96', dark: '#A88A5C' },   // Vàng champagne
        rose:     { DEFAULT: '#B9827A', light: '#CCAAA3', dark: '#956860' },   // Hồng đất
        brown:    { DEFAULT: '#51463F', light: '#7A6B62', dark: '#36302A' },   // Nâu trầm

        // ── Alias giữ lại để không break code cũ ───────
        ivory: {
          50: '#FDFBF7', 100: '#FAF7F0',
          200: '#F4ECE1', 300: '#ECE0CF',
        },
        gold: {
          100: '#F7EDD8', 200: '#EEDCB9', 300: '#E3C68D',
          400: '#D8B062', 500: '#C7A878',
          600: '#A88A5C', 700: '#8A6D3A',
        },
        charcoal: { DEFAULT: '#51463F', light: '#7A6B62', muted: '#9C8D84' },
      },
      fontFamily: {
        script:      ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        calligraphy: ['"Alex Brush"', 'cursive'],
        serif:       ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans:        ['"Be Vietnam Pro"', '"Montserrat"', 'sans-serif'],
      },
      animation: {
        'spin-slow':   'spin 12s linear infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 4s ease-in-out infinite',
        'slide-ken':   'kenburns 12s ease-in-out infinite alternate',
        'fade-in-up':  'fadeInUp 0.8s ease both',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        kenburns: { '0%': { transform: 'scale(1) translate(0,0)' }, '100%': { transform: 'scale(1.08) translate(-2%,-1%)' } },
        fadeInUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'champ-glow': '0 0 24px rgba(199,168,120,0.30)',
        'soft-card':  '0 10px 30px -5px rgba(81,70,63,0.07)',
        'inner-soft': 'inset 0 1px 4px rgba(81,70,63,0.06)',
      },
    },
  },
  plugins: [],
}

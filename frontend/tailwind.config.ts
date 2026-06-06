import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        newsprint: '#F2EFE9',
        ink: '#1E1E1E',
        stamp: '#A64444',
        cardboard: '#DCD7C9',
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        hard: '5px 5px 0px #1E1E1E',
        'hard-sm': '3px 3px 0px #1E1E1E',
        'hard-lg': '8px 8px 0px #1E1E1E',
      },
      clipPath: {
        'torn-1': 'polygon(0% 3%, 2% 0%, 5% 4%, 8% 1%, 12% 5%, 15% 2%, 18% 6%, 22% 1%, 25% 4%, 28% 0%, 32% 3%, 35% 1%, 38% 5%, 42% 2%, 45% 6%, 48% 0%, 52% 4%, 55% 1%, 58% 5%, 62% 2%, 65% 6%, 68% 0%, 72% 3%, 75% 1%, 78% 5%, 82% 2%, 85% 4%, 88% 0%, 92% 3%, 95% 1%, 98% 4%, 100% 2%, 100% 97%, 98% 100%, 95% 96%, 92% 99%, 88% 97%, 85% 100%, 82% 96%, 78% 99%, 75% 97%, 72% 100%, 68% 96%, 65% 99%, 62% 97%, 58% 100%, 55% 96%, 52% 99%, 48% 97%, 45% 100%, 42% 96%, 38% 99%, 35% 97%, 32% 100%, 28% 96%, 25% 99%, 22% 97%, 18% 100%, 15% 96%, 12% 99%, 8% 97%, 5% 100%, 2% 96%, 0% 99%)',
        'torn-2': 'polygon(0% 2%, 3% 5%, 7% 1%, 10% 4%, 14% 0%, 17% 3%, 21% 5%, 24% 1%, 27% 4%, 30% 0%, 33% 3%, 37% 5%, 40% 1%, 43% 4%, 47% 0%, 50% 3%, 53% 5%, 57% 1%, 60% 4%, 63% 0%, 67% 3%, 70% 5%, 73% 1%, 77% 4%, 80% 0%, 83% 3%, 87% 5%, 90% 1%, 93% 4%, 97% 0%, 100% 3%, 100% 98%, 97% 95%, 93% 99%, 90% 96%, 87% 100%, 83% 97%, 80% 95%, 77% 99%, 73% 96%, 70% 100%, 67% 97%, 63% 95%, 60% 99%, 57% 96%, 53% 100%, 50% 97%, 47% 95%, 43% 99%, 40% 96%, 37% 100%, 33% 97%, 30% 95%, 27% 99%, 24% 96%, 21% 100%, 17% 97%, 14% 95%, 10% 99%, 7% 96%, 3% 100%, 0% 97%)',
      },
      keyframes: {
        unfold: {
          '0%': { transform: 'perspective(800px) rotateX(-90deg)', opacity: '0' },
          '60%': { transform: 'perspective(800px) rotateX(5deg)' },
          '100%': { transform: 'perspective(800px) rotateX(0deg)', opacity: '1' },
        },
        'stamp-down': {
          '0%': { transform: 'scale(1.5) rotate(-5deg)', opacity: '0' },
          '70%': { transform: 'scale(0.95) rotate(1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'spring-open': {
          '0%': { maxHeight: '0px', opacity: '0' },
          '70%': { maxHeight: '120%' },
          '100%': { maxHeight: '100%', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120%) rotate(3deg)', opacity: '0' },
        },
      },
      animation: {
        unfold: 'unfold 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        stamp: 'stamp-down 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'spring-open': 'spring-open 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-out': 'slide-out 0.6s ease-in forwards',
      },
    },
  },
  plugins: [],
} satisfies Config

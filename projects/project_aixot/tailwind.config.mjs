/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        'ink-2': '#666666',
        'ink-3': '#aaaaaa',
        rule: '#e0e0e0',
        hover: '#f7f7f7',
      },
      fontFamily: {
        serif: ['Georgia', "'Times New Roman'", 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};

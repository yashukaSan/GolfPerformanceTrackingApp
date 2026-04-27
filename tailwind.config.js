/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        lime: 'var(--lime)',
        teal: 'var(--teal)',
        coral: 'var(--coral)',
        muted2: 'var(--muted2)',
        border: 'var(--border)',
        white: 'var(--white)',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      borderRadius: {
        radius: 'var(--radius)',
      },
    },
  },
  plugins: [],
}
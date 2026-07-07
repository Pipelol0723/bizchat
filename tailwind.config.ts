import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Café Noire (ver design handoff → Design Tokens)
        accent: '#c98a3d',
        'accent-light': '#e0a75c',
        'accent-dark': '#a06a2c',
        'coffee-dark': '#191210',
        coffee: '#241a14',
        cream: '#f5efe6',
        panel: '#fdfaf5',
        footer: '#120d0b',
        online: '#3a9d5c',
        danger: '#c0392b',
        'danger-soft': '#a33333',
      },
      fontFamily: {
        serif: ['var(--font-marcellus)', 'serif'],
        sans: ['var(--font-karla)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        hero: 'radial-gradient(1100px 520px at 50% -10%, #2b1d15 0%, #191210 62%)',
      },
      boxShadow: {
        fab: '0 8px 28px rgba(0,0,0,.45)',
        panel: '0 24px 64px rgba(0,0,0,.5)',
        popover: '0 12px 32px rgba(0,0,0,.18)',
      },
    },
  },
  plugins: [],
}
export default config

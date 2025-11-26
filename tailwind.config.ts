import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'background-tertiary': 'var(--background-tertiary)',
        foreground: 'var(--foreground)',
        'foreground-secondary': 'var(--foreground-secondary)',
        primary: {
          DEFAULT: 'var(--primary)',
          glow: 'var(--primary-glow)',
        },
        'neon-lime': 'var(--neon-lime)',
        'neon-magenta': 'var(--neon-magenta)',
        'neon-cyan': 'var(--neon-cyan)',
        accent: {
          magenta: 'var(--accent-magenta)',
          cyan: 'var(--accent-cyan)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inconsolata)', 'Courier New', 'monospace'],
        display: ['var(--font-orbitron)', 'Impact', 'sans-serif'],
        mono: ['var(--font-inconsolata)', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config

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
        sacramento: {
          gold: '#FFB81C',
          blue: '#0067B1',
          darkblue: '#003D5C',
        },
      },
    },
  },
  plugins: [],
}
export default config


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          blush: '#edafb8',
          peach: '#f7e1d7',
          beige: '#dedbd2',
          sage: '#b0c4b1',
          charcoal: '#4a5759',
        },
        dark: {
          blush: '#3a1f21',       
          peach: '#4a2e2a',
          beige: '#2f2e2b',
          sage: '#37413a',
          charcoal: '#e6e6e6',
        }
      }
    },
  },
  plugins: [],
}

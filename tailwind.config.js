/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        accent: 'var(--accent)',
        title: 'var(--title)',
        card: 'var(--card)',
        border: 'var(--border)',
        hover: 'var(--hover)',
        button: 'var(--button)',
        'button-text': 'var(--button-text)',
        'slot-empty': 'var(--slot-empty)',
        'slot-filled': 'var(--slot-filled)',
        'slot-border': 'var(--slot-border)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brew: {
          ink: '#1f2933',
          muted: '#667085',
          line: '#d8dee4',
          cream: '#f7f3ea',
          tea: '#2f7d5c',
          coffee: '#7a4b2b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

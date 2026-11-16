import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#eef6f4',
          100: '#d6e9e4',
          200: '#b0d4cc',
          500: '#2f7f73',
          600: '#256a60',
          700: '#1e554d',
          900: '#12332f',
        },
        accent: {
          50: '#fdf3ec',
          100: '#fbe6da',
          400: '#e8956b',
          500: '#dd7a4a',
          600: '#c5632f',
        },
        sand: {
          50: '#fbf8f3',
          100: '#f4eee4',
          200: '#e8dfd0',
        },
        ink: '#1f2a28',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(18, 51, 47, 0.18)',
      },
    },
  },
}

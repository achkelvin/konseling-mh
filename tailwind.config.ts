import type { Config } from 'tailwindcss'

// Palet diambil dari logo Rena Jiwa (contents/RenaJiwa_Logo_Pack).
export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        // serif buku yang dekat dengan wordmark "Rena Jiwa"
        display: ['Literata', 'Georgia', 'serif'],
      },
      colors: {
        // hijau hutan (garis logo) + sage (setengah lingkaran kanan)
        brand: {
          50: '#F1F3EE',
          100: '#E1E7DC',
          200: '#C3CFBD',
          300: '#A9B8A0',
          400: '#98AC94',
          500: '#61765F',
          600: '#4A5C4A',
          700: '#384538',
          800: '#2D382E',
          900: '#222B23',
        },
        // terakota dari gradasi "senja" dan tagline
        accent: {
          50: '#FBF1EA',
          100: '#F5DFCF',
          200: '#EDC3A4',
          300: '#E8A583',
          400: '#E3A25F',
          500: '#C46B3F',
          600: '#A9532B',
          700: '#8A4223',
        },
        plum: '#7E5A7A',
        // krem kertas (warna dasar versi reversed)
        sand: {
          50: '#FBF8F2',
          100: '#F5F1E8',
          200: '#E9E2D3',
          300: '#D9D0BE',
        },
        ink: '#273027',
      },
      backgroundImage: {
        senja: 'linear-gradient(180deg, #E3A25F 0%, #C46B3F 50%, #7E5A7A 100%)',
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(34, 43, 35, 0.35)',
      },
    },
  },
}

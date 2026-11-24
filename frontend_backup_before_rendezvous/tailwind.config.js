import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      colors: {
        primary: '#0B0B0B',
        secondary: '#1C1C1C',
        gold: '#D4AF37',
        goldSoft: '#E6C97A',
        ivory: '#F8F6F1',
      },
      fontFamily: {
        heading: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Oswald', 'Arial Narrow', 'system-ui', 'sans-serif'],       // ≈ Futura Condensed Extra Bold
        subheadline: ['Barlow Condensed', 'system-ui', 'sans-serif'],          // ≈ DIN Condensed Bold
        body: ['Barlow', 'system-ui', 'sans-serif'],                            // ≈ DIN
      },
      colors: {
        bft: { teal: '#00C8D7' }, // tweak if your official HEX differs
      },
    },
  },
  plugins: [],
};

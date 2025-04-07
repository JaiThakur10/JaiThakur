/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        mango: ["MangoGrotesque", "sans-serif"],
        instrument: ['"Instrument Sans"', "Arial", "sans-serif"],
      },

      animation: {
        "spin-slow": "spin 20s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};

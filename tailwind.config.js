/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff7f1",
        candy: {
          pink: "#ff6ba6",
          coral: "#ff8a70",
          peach: "#ffc488",
          plum: "#6e4cff",
          grape: "#2c2148",
          ink: "#1f1533"
        }
      },
      boxShadow: {
        float: "0 22px 44px rgba(255, 107, 166, 0.18)",
        card: "0 14px 30px rgba(31, 21, 51, 0.08)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        rise: "rise 0.45s ease-out",
        pulseSoft: "pulseSoft 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

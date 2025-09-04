/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          blue: "#1e40af",
          white: "#ffffff",
        },
        accent: {
          blue: "#3b82f6",
          light: "#dbeafe",
        },
      },
      backgroundImage: {
        hero: "url('/bg_hero.png')",
      },
    },
  },
  plugins: [],
};

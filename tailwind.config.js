/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 200 series
    'bg-gray-200', 'bg-green-200', 'bg-purple-200', 'bg-emerald-200',
    'bg-red-200', 'bg-blue-200', 'bg-yellow-200', 'bg-pink-200', 'bg-amber-200',
    'bg-lime-200', 'bg-orange-200',

    // 300 series
    'bg-gray-300', 'bg-green-300', 'bg-purple-300', 'bg-emerald-300',
    'bg-red-300', 'bg-blue-300', 'bg-yellow-300', 'bg-pink-300', 'bg-amber-300',
    'bg-lime-300', 'bg-orange-300',

    // 400 series
    'bg-gray-400', 'bg-green-400', 'bg-purple-400', 'bg-emerald-400',
    'bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-pink-400', 'bg-amber-400',
    'bg-lime-400', 'bg-orange-400',

    // 500 series
    'bg-gray-500', 'bg-green-500', 'bg-purple-500', 'bg-emerald-500',
    'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-amber-500',
    'bg-lime-500', 'bg-orange-500',

    // 600 series
    'bg-gray-600', 'bg-green-600', 'bg-purple-600', 'bg-emerald-600',
    'bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-pink-600', 'bg-amber-600',
    'bg-lime-600', 'bg-orange-600',

    // 700 series
    'bg-gray-700', 'bg-green-700', 'bg-purple-700', 'bg-emerald-700',
    'bg-red-700', 'bg-blue-700', 'bg-yellow-700', 'bg-pink-700', 'bg-amber-700',
    'bg-lime-700', 'bg-orange-700',

    // 800 series
    'bg-gray-800', 'bg-green-800', 'bg-purple-800', 'bg-emerald-800',
    'bg-red-800', 'bg-blue-800', 'bg-yellow-800', 'bg-pink-800', 'bg-amber-800',
    'bg-lime-800', 'bg-orange-800',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
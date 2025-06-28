import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#F7F7F7',
        'brand-primary': '#021B33',
        'brand-accent': '#12577B',
        'brand-accent-light': '#A9CFE5',
      },
    },
  },
  plugins: [],
};
export default config;
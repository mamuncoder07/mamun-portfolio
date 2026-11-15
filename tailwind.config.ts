import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./config/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#050807", panel: "#0A100E", emerald: "#00F5A0", violet: "#A855F7" } } },
  plugins: [],
};

export default config;

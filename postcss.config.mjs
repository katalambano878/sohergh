/**
 * PostCSS for Next.js: Tailwind v3 (tailwind.config.js `content`) + Autoprefixer.
 * Next requires the `plugins: { name: {} }` shape — not raw plugin functions.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

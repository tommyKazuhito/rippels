/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSpacing: true,
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;

/** @type {import('lint-staged').Config} */
const config = {
  './*.{js,cjs,mjs,ts}': [
    "eslint -c eslint.config.js --fix --ignore-pattern '!.*rc.cjs' --ignore-pattern '!*.config.{js,cjs,mjs,ts}",
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './script/node/*.{js,cjs,mjs,ts}': [
    'eslint -c eslint.config.js --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{js,jsx,cjs,mjs,ts,tsx}': [
    'eslint -c eslint.config.js --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{css,scss}': [
    'stylelint --config stylelint.config.js --fix --aei',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.html': ['markuplint'],
};

export default config;

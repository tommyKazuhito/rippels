import postcssPresetEnv from 'postcss-preset-env';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import tailwindcss from 'tailwindcss';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    tailwindcss(),
    postcssPresetEnv({
      stage: 2,
      minimumVendorImplementations: 2,
    }),
    postcssSortMediaQueries(),
  ],
};

export default config;

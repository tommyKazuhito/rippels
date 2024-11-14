/** @type {import('stylelint').Config} */
const config = {
  syntax: 'scss',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-html/html',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  rules: {
    'no-empty-source': null,
    'block-no-empty': null,
    'font-family-no-missing-generic-family-keyword': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'at-rule-no-vendor-prefix': null,
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['/^\\$/'],
        camelCaseSvgKeywords: true,
      },
    ],
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['initial-scale'],
      },
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['/^\\$[_0-9a-z]+$/', 'dvh'],
      },
    ],
    'selector-class-pattern':
      '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'media-query-no-invalid': null,
    'media-feature-name-no-unknown': null,
    'scss/dollar-variable-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'after-dollar-variable'],
        ignore: ['after-comment'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'screen'],
      },
    ],
  },
};

export default config;

import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginTailwindcss from 'eslint-plugin-tailwindcss';
import pluginUnusedImport from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config} */
const ignoreFiles = {
  ignores: ['node_modules/*', 'public/*'],
};

/** @type {import('eslint').Linter.Config[]} */
const commonConfig = [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: '.',
        project: './tsconfig.json',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'spaced-comment': [
        2,
        'always',
        {
          markers: ['/'],
        },
      ],
      'no-console': 1,
      'no-param-reassign': [
        2,
        {
          props: false,
        },
      ],
      'no-plusplus': 0,
      'no-use-before-define': [
        2,
        {
          functions: false,
        },
      ],
      camelcase: [0, { properties: 'never' }],
      'func-names': [2, 'never'],
      'consistent-return': [
        2,
        {
          treatUndefinedAsUnspecified: true,
        },
      ],
      'prefer-destructuring': [
        2,
        {
          object: true,
          array: false,
        },
      ],
      'class-methods-use-this': 0,
      'lines-between-class-members': ['error', 'always'],
      'no-new': 1,
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipJSXText: true }],
      '@typescript-eslint/no-unused-vars': [
        2,
        { vars: 'all', args: 'none', ignoreRestSiblings: false },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-use-before-define': [
        2,
        {
          ignoreTypeReferences: true,
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        2,
        {
          allowSingleExtends: false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-bitwise': 0,
      '@typescript-eslint/no-inferrable-types': [
        2,
        {
          ignoreParameters: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/consistent-type-assertions': 0,
      '@typescript-eslint/no-this-alias': 0,
      '@typescript-eslint/prefer-arrow-functions': 0,
      '@typescript-eslint/ter-prefer-arrow-callback': 0,
      '@typescript-eslint/object-literal-sort-keys': 0,
      '@typescript-eslint/prefer-template': 0,
      '@typescript-eslint/no-increment-decrement': 0,
      '@typescript-eslint/naming-convention': [
        2,
        {
          selector: ['parameterProperty', 'typeProperty'],
          format: ['camelCase', 'PascalCase', 'snake_case'],
        },
      ],
    },
  },
];

/** @type {import('eslint').Linter.Config} */
const importConfig = {
  plugins: {
    import: pluginImport,
    'unused-imports': pluginUnusedImport,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
  rules: {
    'import/no-cycle': [0],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        '': 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: [
          '*.config.{js,cjs,mjs,ts}',
          '.*rc.{js,cjs,mjs}',
          'plopfile.*',
          'script/**',
          'src/config/**',
          'src/wp-blocks/**/*.{js,cjs,mjs,ts,tsx,jsx,jsx}',
          'src/__tests__/**/*.{ts,tsx,jsx,jsx}',
          'src/__mocks__/**/*.{ts,tsx,jsx,jsx}',
        ],
        packageDir: ['./', './node_modules/@wordpress/scripts/'],
        optionalDependencies: false,
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'type', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [
          {
            pattern: '@root/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '*project.config.*js',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/no-unresolved': [2, { ignore: ['astro:content$'] }],
  },
};

/** @type {import('eslint').Linter.Config} */
const tsConfig = {
  files: ['**/*.ts'],
  rules: {
    ...tseslint.configs.recommendedTypeChecked.rules,
  },
};

/** @type {import('eslint').Linter.Config} */
const tailwindConfig = {
  plugins: {
    tailwindcss: pluginTailwindcss,
  },
  settings: {
    tailwindcss: {
      cssFiles: ['src/styles/main.scss'],
      callees: ['cn'],
      whitelist: [
        '^[^\\s]+((?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?)|(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?))?$',
      ],
    },
  },
  rules: {
    'tailwindcss/no-custom-classname': 2,
  },
};

export default [...commonConfig, importConfig, tsConfig, tailwindConfig, ignoreFiles];

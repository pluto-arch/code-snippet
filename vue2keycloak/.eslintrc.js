module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/multi-word-component-names': ['off'],
    'vue/prop-name-casing': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'no-new': 'off',
    'prefer-regex-literals': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-unused-vars': [
      'off',
      {
        caughtErrors: 'none',
      },
    ],
    'vue/no-unused-vars': [
      'off',
      {
        caughtErrors: 'none',
      },
    ],
    'no-tabs': 'off',
    'no-trailing-spaces': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-empty-function': 'off',
    'space-before-function-paren': ['off', 'always'],
    'no-unreachable-loop': 'off',
    'no-multiple-empty-lines': 'off',
    'no-loss-of-precision': 'off',
    'no-useless-escape': 0,
    semi: ['warn', 'never'],
    eqeqeq: 0,
    indent: ['off', 2],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
  },
}

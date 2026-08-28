export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-rational-order',
  ],
  ignoreFiles: [
    '**/dist/**',
    '**/node_modules/**',
    'docs/.vitepress/**',
  ],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'import-notation': null,
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?|--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      { resolveNestedSelectors: true },
    ],
    'no-descending-specificity': null,
  },
  plugins: [
    'stylelint-order',
  ],
  overrides: [
    {
      files: ['**/*.(less|css|vue|html)'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
}

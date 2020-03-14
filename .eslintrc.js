module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'no-unused-vars':0,
    'no-trailing-spaces':0,
    'no-useless-return':0,
    'vue/no-unused-vars':0,
    'eol-last':0,
    'padded-blocks':0
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}

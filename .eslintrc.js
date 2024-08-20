// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true, // 将此配置文件设置为根配置文件，不再向上查找
  env: {
    browser: true, // 浏览器环境
    node: true,    // Node.js 环境
    es6: true      // 支持 ES6 语法
  },
  parser: 'vue-eslint-parser', // 使用 Vue ESLint 解析器
  parserOptions: {
    parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
    ecmaVersion: 2020, // 支持 ECMAScript 2020 语法
    sourceType: 'module', // 使用 ES 模块
    jsxPragma: 'React', // 使用 React JSX 语法
    ecmaFeatures: {
      jsx: true // 启用 JSX
    }
  },
  extends: [
    'plugin:vue/vue3-recommended', // Vue 3 推荐规则
    'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
    'prettier', // 启用 Prettier 规则
    'plugin:prettier/recommended' // 启用 Prettier 推荐规则
  ],
  rules: {
    'vue/no-setup-props-destructure': 'off', // 关闭 setup 中解构 props 的警告
    'vue/script-setup-uses-vars': 'error', // 在 script setup 中使用变量时报错
    'vue/no-reserved-component-names': 'off', // 允许使用保留的组件名称
    '@typescript-eslint/ban-ts-ignore': 'off', // 允许使用 @ts-ignore 注释
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭显式函数返回类型要求
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    '@typescript-eslint/no-var-requires': 'off', // 允许使用 require 语句
    '@typescript-eslint/no-empty-function': 'off', // 允许空函数
    'vue/custom-event-name-casing': 'off', // 关闭自定义事件名称格式的规则
    'no-use-before-define': 'off', // 关闭定义前使用变量的规则
    '@typescript-eslint/no-use-before-define': 'off', // 关闭 TypeScript 定义前使用变量的规则
    '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts- 注释
    '@typescript-eslint/ban-types': 'off', // 允许使用特定类型
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用非空断言
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭显式模块边界类型的规则
    '@typescript-eslint/no-unused-vars': 'off', // 关闭 TypeScript 未使用变量的规则
    'no-unused-vars': 'off', // 关闭未使用变量的规则
    'space-before-function-paren': 'off', // 关闭函数括号前空格的规则

    'vue/attributes-order': 'off', // 关闭属性顺序规则
    'vue/one-component-per-file': 'off', // 关闭每个文件一个组件的规则
    'vue/html-closing-bracket-newline': 'off', // 关闭 HTML 标签闭合括号换行规则
    'vue/max-attributes-per-line': 'off', // 关闭每行最大属性数的规则
    'vue/multiline-html-element-content-newline': 'off', // 关闭多行 HTML 元素内容换行规则
    'vue/singleline-html-element-content-newline': 'off', // 关闭单行 HTML 元素内容换行规则
    'vue/attribute-hyphenation': 'off', // 关闭属性连字符化的规则
    'vue/require-default-prop': 'off', // 关闭要求默认 prop 的规则
    'vue/require-explicit-emits': 'off', // 关闭要求显式 emits 的规则
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // HTML void 元素始终自闭合
          normal: 'never', // HTML 普通元素不自闭合
          component: 'always' // 组件始终自闭合
        },
        svg: 'always', // SVG 元素始终自闭合
        math: 'always' // Math 元素始终自闭合
      }
    ],
    'vue/multi-word-component-names': 'off', // 关闭多字组件名的规则
    'vue/no-v-html': 'off', // 关闭禁止使用 v-html 的规则
    'vue/require-toggle-inside-transition': 'off' // 关闭要求在过渡内使用 toggle 的规则
  }
})

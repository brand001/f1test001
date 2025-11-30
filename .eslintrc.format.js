module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    plugins: ["prettier"],
    extends: ["plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false,
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // 🎯 纯格式化规则 - 100%不影响代码逻辑
        "prettier/prettier": "error",

        // 缩进和空格
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // 括号空格
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "computed-property-spacing": ["error", "never"],
        "template-curly-spacing": ["error", "never"],

        // 换行相关
        "linebreak-style": "off",
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
        "no-trailing-spaces": "error",
        "eol-last": "error",

        // 逗号相关
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", { "before": false, "after": true }],

        // 关闭所有可能影响逻辑的规则
        "no-unused-vars": "off",
        "no-undef": "off",
        "no-console": "off",
        "no-debugger": "off",
        "no-unreachable": "off",
        "no-empty": "off",
        "no-constant-condition": "off",
    },
}; 
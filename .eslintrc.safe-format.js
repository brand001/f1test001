module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // 🎯 只处理基本格式，绝不删除代码或检查语法

        // ✅ 缩进
        "indent": ["error", 4],

        // ✅ 引号
        "quotes": ["error", "double"],

        // ✅ 分号
        "semi": ["error", "always"],

        // ✅ 对象大括号空格
        "object-curly-spacing": ["error", "always"],

        // ✅ 数组括号空格
        "array-bracket-spacing": ["error", "never"],

        // ✅ 逗号后空格
        "comma-spacing": ["error", { "before": false, "after": true }],

        // ✅ 关键字后空格
        "keyword-spacing": ["error", { "before": true, "after": true }],

        // ✅ 运算符周围空格
        "space-infix-ops": "error",

        // ✅ 删除多余空格
        "no-trailing-spaces": "error",        // 删除行尾空格
        "no-multi-spaces": "error",           // 删除多余空格
        "space-before-blocks": "error",       // 块前空格
        "space-before-function-paren": ["error", "never"], // 函数名后不要空格
        "space-in-parens": ["error", "never"],           // 括号内不要空格
        "object-curly-newline": "off",        // 不强制对象换行
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }], // 冒号空格

        // ❌ 关闭所有检查规则，只保留格式化
        "no-unused-vars": "off",
        "no-undef": "off",
        "no-console": "off",
        "no-extra-parens": "off",
        "prefer-const": "off",
    },
}; 
# 使用 @Context 别名指南

## ✅ **已完成的配置**

在 `babel.config.js` 中已添加：
```javascript
"@Context": "./src/contexts",
```

## 🚀 **如何使用新别名**

### **1. 基本使用方式**
```javascript
// ✅ 使用新别名（推荐）
import { useApp } from "@Context/AppContext";
import { AppProvider } from "@Context";

// ❌ 旧的相对路径方式
import { useApp } from "../contexts/AppContext";
import { useApp } from "../../contexts/AppContext";
```

### **2. 不同导入方式对比**

#### **从 contexts 目录导出**
```javascript
// src/contexts/index.js
export { AppProvider, useApp } from './AppContext';
export { default as AppContext } from './AppContext';

// 使用方式
import { useApp, AppProvider } from "@Context";
import AppContext from "@Context/AppContext";
```

#### **直接导入特定文件**
```javascript
// 直接导入AppContext.js
import { useApp } from "@Context/AppContext";
import AppContext from "@Context/AppContext";
```

## 🔄 **启用新别名的步骤**

### **步骤1: 重启 Metro Bundler**
```bash
# 停止当前的开发服务器
# 然后清除缓存并重启
npx react-native start --reset-cache
```

### **步骤2: 更新导入语句**
在需要使用Context的文件中：

```javascript
// 示例：更新 ContextDemo.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useApp } from "@Context/AppContext";  // 使用新别名

const ContextDemo = () => {
    const { language, isLoading, showError } = useApp();
    // ... 组件代码
};
```

### **步骤3: 更新类组件中的导入**
```javascript
// 示例：更新 Home/index.js
import React from "react";
import AppContext from "@Context/AppContext";  // 使用新别名

class Home extends React.Component {
    static contextType = AppContext;
    
    // ... 组件代码
}
```

## ⚠️ **ESLint 警告解决**

你可能会看到ESLint错误：
```
Unable to resolve path to module '@Context/AppContext'
```

### **解决方案1: 配置 ESLint (推荐)**
在 `.eslintrc.js` 中添加：
```javascript
module.exports = {
  // ... 现有配置
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
};
```

### **解决方案2: 安装 eslint-import-resolver-babel-module**
```bash
npm install --save-dev eslint-import-resolver-babel-module
```

### **解决方案3: 临时忽略 (快速方案)**
在导入行上方添加：
```javascript
// eslint-disable-next-line import/no-unresolved
import { useApp } from "@Context/AppContext";
```

## 📂 **推荐的项目结构**

```
src/
├── contexts/
│   ├── index.js          # 统一导出所有Context
│   ├── AppContext.js     # 主要应用Context
│   ├── UserContext.js    # 用户相关Context（未来可添加）
│   └── ThemeContext.js   # 主题Context（未来可添加）
└── components/
    └── ContextDemo.js    # 使用 @Context 别名
```

## 🎯 **使用示例**

### **在函数组件中使用**
```javascript
import React from "react";
import { useApp } from "@Context/AppContext";

const MyComponent = () => {
  const { language, setLanguage, showError } = useApp();
  
  return (
    <View>
      <Text>当前语言: {language}</Text>
      <Button 
        title="切换语言" 
        onPress={() => setLanguage('EN')} 
      />
    </View>
  );
};
```

### **在类组件中使用**
```javascript
import React, { Component } from "react";
import AppContext from "@Context/AppContext";

class MyClassComponent extends Component {
  static contextType = AppContext;
  
  handleAction = () => {
    const { showError, setLanguage } = this.context;
    setLanguage('TH');
    showError('操作完成');
  };
  
  render() {
    const { language, isLoading } = this.context;
    return (
      <View>
        <Text>语言: {language}</Text>
        <Text>加载中: {isLoading ? '是' : '否'}</Text>
      </View>
    );
  }
}
```

## 🔧 **故障排除**

### **问题1: 别名不生效**
**解决方案**: 确保重启了Metro bundler
```bash
npx react-native start --reset-cache
```

### **问题2: ESLint报错**
**解决方案**: 配置ESLint导入解析器或临时忽略

### **问题3: TypeScript支持**
如果使用TypeScript，在 `tsconfig.json` 中添加：
```json
{
  "compilerOptions": {
    "paths": {
      "@Context/*": ["src/contexts/*"]
    }
  }
}
```

## 🎉 **优势总结**

使用 `@Context` 别名的好处：

1. **简洁性**: `@Context/AppContext` vs `../../contexts/AppContext`
2. **一致性**: 所有Context导入都使用统一格式
3. **重构友好**: 移动文件时不需要修改导入路径
4. **可读性**: 清楚表明导入的是Context相关模块
5. **扩展性**: 便于添加新的Context类型

## 📝 **下一步**

1. 重启Metro bundler以激活新别名
2. 逐步更新现有文件使用新别名
3. 在新开发的组件中统一使用 `@Context` 别名
4. 考虑配置ESLint以消除警告

现在你就可以使用更简洁的 `@Context/AppContext` 来导入Context了！🚀 
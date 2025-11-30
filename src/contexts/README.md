# AppContext 使用指南

## 概述

AppContext 为 F1-APP-ST 应用提供了全局状态管理和通用方法。它与现有的 Redux 系统并行工作，主要用于管理应用级别的状态和提供便捷的工具方法。

## 功能特性

### 状态管理
- **语言设置**: 当前应用语言 (CN/TH/VN)
- **加载状态**: 全局加载状态管理
- **版本信息**: 应用版本、更新状态
- **网络状态**: 网络连接状态
- **用户状态**: 登录状态和用户信息
- **维护状态**: 应用维护模式

### 工具方法
- **弹窗管理**: 错误、成功、确认弹窗
- **状态更新**: 各种状态的更新方法
- **应用控制**: 重启应用、权限检查

## 快速开始

### 1. 基础使用

```javascript
import React from 'react';
import { useApp } from '../contexts/AppContext';

const MyComponent = () => {
  const { language, setLanguage, showError } = useApp();
  
  return (
    <View>
      <Text>当前语言: {language}</Text>
    </View>
  );
};
```

### 2. 状态读取

```javascript
const {
  language,        // 当前语言
  isLoading,       // 加载状态
  version,         // 版本信息对象
  network,         // 网络状态对象
  user,            // 用户状态对象
  maintenance      // 维护状态对象
} = useApp();
```

### 3. 状态更新

```javascript
const {
  setLanguage,         // 设置语言
  setLoading,          // 设置加载状态
  updateVersionInfo,   // 更新版本信息
  updateNetworkStatus, // 更新网络状态
  updateUserStatus,    // 更新用户状态
  setMaintenance       // 设置维护状态
} = useApp();

// 使用示例
setLanguage('TH');
setLoading(true);
updateVersionInfo({
  current: '1.0.0',
  latest: '1.0.1',
  hasUpdate: true,
  isMandatory: false
});
```

### 4. 弹窗方法

```javascript
const { showError, showSuccess, showConfirm } = useApp();

// 显示错误弹窗
showError('NETWORK_ERROR', '网络连接失败');

// 显示成功弹窗
showSuccess('SAVE_SUCCESS', '保存成功');

// 显示确认弹窗
showConfirm(
  '确认删除',
  '确定要删除这个项目吗？',
  () => console.log('确认'),
  () => console.log('取消')
);
```

## 详细 API

### 状态对象结构

#### version 对象
```javascript
{
  current: '',      // 当前版本
  latest: '',       // 最新版本
  hasUpdate: false, // 是否有更新
  isMandatory: false // 是否强制更新
}
```

#### network 对象
```javascript
{
  isConnected: true, // 是否连接
  type: 'wifi'       // 连接类型
}
```

#### user 对象
```javascript
{
  isLoggedIn: false, // 是否登录
  profile: null      // 用户信息
}
```

#### maintenance 对象
```javascript
{
  isActive: false,   // 是否维护中
  message: ''        // 维护消息
}
```

### 方法 API

#### setLanguage(language)
设置应用语言
- **参数**: `language` (string) - 语言代码 (CN/TH/VN)

#### setLoading(isLoading)
设置全局加载状态
- **参数**: `isLoading` (boolean) - 是否加载中

#### updateVersionInfo(versionInfo)
更新版本信息
- **参数**: `versionInfo` (object) - 版本信息对象

#### updateNetworkStatus(networkStatus)
更新网络状态
- **参数**: `networkStatus` (object) - 网络状态对象

#### updateUserStatus(userStatus)
更新用户状态
- **参数**: `userStatus` (object) - 用户状态对象

#### setMaintenance(maintenanceInfo)
设置维护状态
- **参数**: `maintenanceInfo` (object) - 维护信息对象

#### showError(errorKey, customMessage)
显示错误弹窗
- **参数**: 
  - `errorKey` (string) - 错误键值
  - `customMessage` (string, 可选) - 自定义消息

#### showSuccess(successKey, customMessage)
显示成功弹窗
- **参数**: 
  - `successKey` (string) - 成功键值
  - `customMessage` (string, 可选) - 自定义消息

#### showConfirm(title, message, onConfirm, onCancel)
显示确认弹窗
- **参数**: 
  - `title` (string) - 弹窗标题
  - `message` (string) - 弹窗消息
  - `onConfirm` (function) - 确认回调
  - `onCancel` (function) - 取消回调

#### checkAppPermissions()
检查应用权限
- **返回**: Promise<boolean>

#### restartApp()
重启应用

## 集成说明

### 在 App.js 中的集成

AppContext 已经在 `App.js` 中作为最外层 Provider 包装了整个应用：

```javascript
import { AppProvider } from './contexts/AppContext';

// 在 render 方法中
return (
  <AppProvider>
    <Provider store={store}>
      {/* 其他组件 */}
    </Provider>
  </AppProvider>
);
```

### 与 Redux 的关系

AppContext 与 Redux 并行工作：
- **Redux**: 处理复杂的业务逻辑状态
- **AppContext**: 处理应用级别的通用状态和工具方法

### 在现有组件中使用

对于新的函数组件，可以直接使用 `useApp` Hook：

```javascript
import { useApp } from '../contexts/AppContext';

const NewComponent = () => {
  const { language, showError } = useApp();
  // 组件逻辑
};
```

对于现有的类组件，可以使用 HOC 或在需要时进行转换。

## 最佳实践

### 1. 状态管理选择
- 应用级别的简单状态 → 使用 AppContext
- 复杂的业务逻辑状态 → 使用 Redux
- 组件级别的状态 → 使用 local state

### 2. 错误处理
```javascript
try {
  const result = await someApiCall();
  showSuccess('操作成功');
} catch (error) {
  showError('API_ERROR', error.message);
}
```

### 3. 语言切换
```javascript
const handleLanguageChange = (newLanguage) => {
  showConfirm(
    '确认切换',
    `确定要切换到 ${newLanguage} 吗？`,
    () => {
      setLanguage(newLanguage);
      // 触发实际的语言切换逻辑
      if (window.ChangeLanguag) {
        window.ChangeLanguag(newLanguage);
      }
    }
  );
};
```

### 4. 版本检查集成
```javascript
const handleVersionCheck = async () => {
  setLoading(true);
  try {
    const versionInfo = await checkForUpdates();
    updateVersionInfo(versionInfo);
    if (versionInfo.hasUpdate) {
      showSuccess('发现新版本');
    }
  } catch (error) {
    showError('版本检查失败');
  } finally {
    setLoading(false);
  }
};
```

## 注意事项

1. **性能考虑**: 使用 `useCallback` 优化方法，避免不必要的重渲染
2. **错误边界**: Context 已包含错误处理，但组件内部仍需适当的错误处理
3. **类型安全**: 建议在 TypeScript 项目中添加类型定义
4. **向后兼容**: 与现有 Redux 系统保持兼容，不会影响现有功能

## 示例

参考 `src/components/AppContextExample.js` 文件查看完整的使用示例。 
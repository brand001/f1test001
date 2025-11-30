# F1 APP ─ JIRA 測試工作流指南

> **本文件整合了原 `CURSOR-PROMPTS.md` 及 `JIRA-AUTOMATION-QUICK-START.md`，所有內容以此為準。**

## 1️⃣ 快速指令

| 指令 | 說明 | 背後 Rule |
|------|------|-----------|
| `/Generate Tests` | 產生 / 更新測試檔案 | generate-tests-for-changes.mdc |
| `/Run JIRA Tests` | 執行 test-jira-changes.sh 完整流程 | jira-testing-workflow.mdc |
| `/API Tests Only` | 只跑 API 測試 | jira-testing-workflow.mdc |
| `/Quick Check` | ESLint + 基本測試 | jira-testing-workflow.mdc |
| `/Check Results` | 解析最近一次執行結果 | jira-testing-workflow.mdc |

> 更多指令詳見 `jira-testing-workflow.mdc`。

---

## 2️⃣ 使用建議流程

### 完整開發流程
```bash
/Generate Tests   # 建立測試檔案
/Run JIRA Tests  # 執行測試腳本
/Check Results   # 查看報告
```

### API 開發流程
```bash
/Generate API Tests
/API Tests Only
```

### 快速檢查
```bash
/Quick Check
```

---

## 3️⃣ test-jira-changes.sh 流程概覽
1. 預處理：掃描 API、缺失測試檔自動建置  
2. ESLint 檢查  
3. API 測試（CN/TH/VN）  
4. Component / Container 測試  
5. Redux 測試  
6. Locales 測試  
7. 基本 App 測試

### 報告範例
```markdown
📊 測試摘要
- JIRA: CXPC-1830
- 測試: 20 通過 / 1 失敗
- 覆蓋率: 87%

🔧 建議
1. 修正 Login.test.js
2. 更新 Confluence API 文檔
```

---

## 4️⃣ Prompt 範本

### A. 產生測試檔
```
@generate-tests-for-changes.mdc

我完成了 JIRA ticket [JIRA_ID]，修改了：
- src/components/LoginForm.js
- src/actions/UserApi.js

請產生測試檔案。
```

### B. 執行測試
```
@jira-testing-workflow.mdc

JIRA ID: [JIRA_ID]
修改檔案: [檔案列表]
請執行 test-jira-changes.sh 並提供報告。
```

---

## 5️⃣ 常見 FAQ
1. **為何測試未自動產生？**  先執行 `/Generate Tests`。  
2. **腳本執行很慢？**  使用 `--quick` 或 `--api-only`。  
3. **Confluence 驗證怎麼做？** 腳本會列出 API 端點，需人工比對。

---

> 更新：`2025-07-10`

---

## 6️⃣ 自動檔案創建

### 系統會自動創建以下測試檔案：
```
你的修改：
├── src/containers/Login/Login.js
├── src/actions/UserApi.js  
└── src/components/LoginForm.js

系統自動創建：
├── __tests__/unit/containers/Login.test.js
├── __tests__/api/UserApi.test.js
├── __tests__/api/contract/UserApi-contract.test.js
├── __tests__/unit/components/LoginForm.test.js
└── __tests__/acceptance/CXPC-1830-acceptance.test.js
```

## 7️⃣ 實際使用範例

### 範例 1: 登入功能開發完成
```
# 你剛完成了生物識別登入功能
# 分支: CXPC-1830_biometric-login
# 修改: Login.js, UserApi.js, BiometricAuth.js

# 一鍵測試：
/Generate Tests

# 結果：
✅ 創建 5 個測試檔案
✅ 執行 23 個測試案例  
✅ 測試覆蓋率 87%
✅ 多語言測試通過 (CN/TH/VN)
✅ API 文檔驗證通過
📝 commit message 已準備
```

### 範例 2: 只修改了 API
```
# 你只修改了支付 API
# 修改: PaymentApi.js

# API 專用測試：
/API Tests

# 結果：
✅ 檢測到 3 個 API 端點
✅ 創建 API 測試和契約驗證
✅ 多環境測試通過 (CN/TH/VN)
✅ Central Payment 整合測試通過
📚 Confluence 文檔一致性驗證
```

### 範例 3: 新增 React 組件
```
# 你創建了新的交易圖表組件
# 新增: TradingChart.js, PriceDisplay.js

# 組件專用測試：
/Component Tests

# 結果：
✅ 創建組件單元測試
✅ Props 和事件處理測試
✅ 渲染性能測試
✅ Redux 狀態整合測試
✅ 多語言 UI 測試
```

## 8️⃣ 進階功能

### 指定特定檔案
```
/Generate Tests CXPC-1830 src/containers/Login/Login.js src/actions/UserApi.js
```

### 包含 Confluence 驗證
```
/API Tests --with-confluence
```

### 跳過 ESLint 檢查
```
/Generate Tests --skip-eslint
```

### 只創建測試不執行
```
/Generate Tests --create-only
```

## 9️⃣ 與現有工具整合

1. 與 `test-jira-changes.sh` 腳本整合  
2. 與 Git 整合：自動檢測修改檔案、提取分支 JIRA ID、生成標準 commit message  
3. 與 Confluence 整合：API 文檔一致性驗證、搜尋相關文檔、比對差異

## 🔟 效率對比

| 方式           | 時間       | 覆蓋率    | 一致性   |
|--------------|----------|---------|--------|
| 手動創建測試    | 45-60 分鐘 | 40-60%  | 不一致  |
| 使用腳本       | 15-20 分鐘 | 60-75%  | 部分一致 |
| 快速指令       | 2-5 分鐘   | 85-95%  | 完全一致 |

## ⓫ 獲取幫助

- 📖 詳細文檔: [JIRA-TESTING-GUIDE.md](mdc:docs/JIRA-TESTING-GUIDE.md)  
- 🔧 腳本使用: [scripts/test-jira-changes.sh](mdc:scripts/test-jira-changes.sh)  
- 🎯 Rules: `.cursor/rules/jira-testing-workflow.mdc`
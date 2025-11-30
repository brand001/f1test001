---
alwaysApply: false
---
請產出 github PR 內容, 產出 PR 的結果請用 "英文" 輸出，

step1.
先取得 origin/master 的 commit SHA，
然後檢查當前 git branch 是否包含該 commit SHA。

若有則將格式內代碼，請將
- [ ] Already contains origin/master codebase
變成
- [X] Already contains origin/master codebase

；若無則停下動作 提醒需先合併 origin/master

step2.
執行 git branch --show-current | sed -E 's/[-_][^-_]*$//'
其 output 結果視為 "票號variable" 並自動替換

step3.
執行 `git diff origin/master "當前gitBranchName"`，基於這個 git diff 生成 PR 內容。
檢查過大小寫、註釋、引用正確。

若一切正確則將格式內，請將
- [ ] That typing, comment and reference are correct
變成
- [X] That typing, comment and reference are correct

若修改行數小於180行，請將
- [ ] These code-changes of this PR are less than 150-180 lines
變成
- [X] These code-changes of this PR are less than 150-180 lines

final step.
輸出 PR 內容為 markdown, 請遵循以下格式, 以英文輸出：

## JIRA ticket

[票號variable](https://arcadie.atlassian.net/browse/票號variable)

## Related Link(s)

- e.g. [若需動多個代碼庫，請提供關聯PR](mdc:the pr link)
- e.g. [title](mdc:https:/github.com/a0921313520/central-payment-m23/pull)

## Essential Code-changes List

- e.g. 串接xxx api
- e.g. 根據api回傳新增下拉選單

## The effect scope of code-changes

- e.g. `src/components/Button.tsx` - 優化按鈕樣式
- e.g. `pages/index.tsx` - 新增首頁 Banner

## Rollback Solution

- e.g. revert PR
- e.g. feature flag 關閉

## Performance/Security check

- e.g. 無明顯效能影響

## PR check-list

- [ ] Already contains origin/master codebase
- [ ] That typing, comment and reference are correct
- [X] This PR already contains specific title, description and commit
- [ ] These code-changes of this PR are less than 150-180 lines (excluding assets/images/binary files)

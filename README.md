# Positive-Affirmation-Cards-for-Kids

## Google Sheet 跨裝置同步設定

1. 建立一份新的 Google Sheet。
2. 在 Google Sheet 選單點 `擴充功能 > Apps Script`。
3. 將 [google_apps_script.gs](google_apps_script.gs) 內容完整貼到 Apps Script 編輯器並儲存。
4. 點 `部署 > 新增部署 > 網頁應用程式`。
5. 設定：
	- 執行身分：`我`
	- 存取權限：`任何人`
6. 部署後複製 `Web App URL`。
7. 開啟網站 [daily_positive_card_draw.html](daily_positive_card_draw.html)（或 GitHub Pages 首頁）。
8. 在 `家長設定` 填入：
	- `Google Apps Script 網址`
	- `家庭代碼`（同一組裝置請填相同值）
9. 按 `雲端同步`，看到 `同步完成，跨裝置可見` 即完成。

## 同步內容

- 抽卡歷史（包含同一天固定卡片）
- 完成狀態
- 反思文字
- 翻卡人
- 成長地圖進度與統計
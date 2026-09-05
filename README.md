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
7. 如果你後續有修改 Apps Script 程式，請再做一次 `部署 > 管理部署 > 編輯 > 新版本`，否則網站會繼續使用舊程式。
8. 開啟網站 [daily_positive_card_draw.html](daily_positive_card_draw.html)（或 GitHub Pages 首頁）。
9. 在 `家長設定` 填入：
	- `Google Apps Script 網址`
	- `家庭代碼`（同一組裝置請填相同值）
10. 按 `雲端同步`，看到 `同步完成，跨裝置可見` 即完成。

## 同步內容

- 抽卡歷史（包含同一天固定卡片）
- 完成狀態
- 反思文字
- 翻卡人
- 成長地圖進度與統計

## 同步失敗排除

1. 網址必須是 Web App 的 `.../exec`，不是 `.../dev`。
2. Apps Script 必須設定為 `任何人` 可存取。
3. 每次改 Apps Script 程式後，必須重新部署新版本。
4. `家庭代碼` 在所有裝置必須完全相同（大小寫也要一致）。
5. 若顯示已送出但另一台未更新，請在另一台按一次 `雲端同步` 拉取最新資料。
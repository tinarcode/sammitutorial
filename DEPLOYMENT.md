# 部署說明

## 架構說明

這個專案採用**前後端分離**的架構：

- **前端**：放在 GitHub Pages（公開）
  - `index.html`
  - `script.js`
  - `styles.css`
  - `api-config.js`

- **後端**：放在 NAS Web 伺服器（私有，不放在 GitHub）
  - `backend/api.php`
  - `backend/testdb.php`
  - `backend/config.php`

## 部署步驟

### 1. 前端部署（GitHub Pages）

1. 將以下檔案上傳到 GitHub：
   - `index.html`
   - `script.js`
   - `styles.css`
   - `api-config.js`（**重要：需要修改 API URL**）

2. 在 `api-config.js` 中修改 API URL：
   ```javascript
   const API_CONFIG = {
       baseURL: 'https://您的NAS網址/backend/api.php',
       testURL: 'https://您的NAS網址/backend/testdb.php'
   };
   ```

3. 啟用 GitHub Pages

### 2. 後端部署（NAS Web 伺服器）

1. 在 NAS 的 Web 伺服器目錄建立 `backend` 資料夾

2. 上傳以下檔案到 NAS：
   - `backend/api.php`
   - `backend/testdb.php`
   - `backend/config.php`

3. 確認 NAS 的 Web 伺服器支援 PHP

4. 確認 NAS 的 MySQL 服務正在運行

5. 測試 API 是否可以訪問：
   ```
   https://您的NAS網址/backend/testdb.php
   ```

### 3. 安全性設定

1. **不要將 `backend` 資料夾上傳到 GitHub**
   - 確認 `.gitignore` 中有 `backend/`
   - 資料庫憑證會暴露在 `backend/config.php` 中

2. **建議修改 CORS 設定**（生產環境）
   - 在 `backend/api.php` 和 `backend/testdb.php` 中
   - 將 `Access-Control-Allow-Origin: *` 改為：
   ```php
   header('Access-Control-Allow-Origin: https://您的GitHubPages網址');
   ```

3. **資料庫安全**
   - 確保資料庫使用者權限最小化
   - 建議使用非 root 使用者
   - 定期更新密碼

## 測試流程

1. 開啟 GitHub Pages 上的網站
2. 網站會自動調用 NAS 上的 API
3. API 會連接到 NAS 的資料庫
4. 結果會回傳到前端顯示

## 檔案結構

```
GitHub Pages (公開):
├── index.html
├── script.js
├── styles.css
└── api-config.js

NAS Web Server (私有):
└── backend/
    ├── api.php
    ├── testdb.php
    └── config.php (包含資料庫憑證)
```

## 注意事項

- GitHub Pages 不支援 PHP，所以後端必須放在 NAS
- 確保 NAS 的 Web 伺服器可以從外部訪問（或使用 VPN）
- API 回應格式為 JSON
- 目前 API 只允許 SELECT 查詢（防止資料被修改）

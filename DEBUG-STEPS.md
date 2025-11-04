# 連線問題診斷步驟

## 當前問題
錯誤訊息：`"Failed to fetch"` - 表示前端無法連接到 NAS API

## 診斷步驟

### 步驟 1：確認 PHP 環境正常
直接在瀏覽器訪問：
```
https://singchibu.synology.me/sammitutorial/backend/test-simple.php
```

**預期結果：**
```json
{
  "status": "success",
  "message": "PHP API 正在運行！",
  "server_info": {
    "php_version": "7.x.x",
    "server_time": "2025-11-04 ...",
    "server_software": "..."
  }
}
```

**如果失敗：**
- [ ] 檢查檔案是否已上傳到 NAS
- [ ] 檢查路徑是否正確（可能是 `/web/sammitutorial/backend/` 或其他位置）
- [ ] 檢查 NAS Web Station 是否正在運行
- [ ] 檢查 PHP 是否已啟用

---

### 步驟 2：測試資料庫連線（使用 localhost）
直接在瀏覽器訪問：
```
https://singchibu.synology.me/sammitutorial/backend/testdb-localhost.php
```

**預期結果（成功）：**
```json
{
  "status": "success",
  "message": "資料庫連線成功！（使用 localhost）",
  "data": {
    "mysql_version": "...",
    "database_name": "sammitutorial",
    ...
  }
}
```

**預期結果（失敗但有錯誤訊息）：**
```json
{
  "status": "error",
  "message": "資料庫連線失敗",
  "error": "詳細錯誤訊息..."
}
```

**如果出現資料庫錯誤：**
- [ ] 檢查 MySQL/MariaDB 服務是否運行
- [ ] 檢查資料庫 `sammitutorial` 是否存在
- [ ] 檢查使用者 `root` 的密碼是否正確
- [ ] 嘗試在 NAS 的 phpMyAdmin 登入測試

---

### 步驟 3：測試原始 API（使用域名連接資料庫）
直接在瀏覽器訪問：
```
https://singchibu.synology.me/sammitutorial/backend/testdb.php
```

**這個使用 `singchibu.synology.me` 作為資料庫主機，可能需要額外的網路設定**

---

### 步驟 4：從 GitHub Pages 測試

如果步驟 1-3 都成功，更新 `api-config.js` 並推送到 GitHub：

```javascript
const API_CONFIG = {
    // 如果步驟 2 成功，使用 localhost 版本
    testURL: 'https://singchibu.synology.me/sammitutorial/backend/testdb-localhost.php',
    
    // 或者如果步驟 3 成功，使用原始版本
    // testURL: 'https://singchibu.synology.me/sammitutorial/backend/testdb.php',
};
```

然後訪問：
```
https://tinarcode.github.io/sammitutorial/test-js-db.html
```

---

## 常見問題

### 1. "Failed to fetch" - 完全無法連接
**原因：**
- 網路問題
- URL 錯誤
- CORS 問題
- HTTPS/HTTP 混合內容

**檢查：**
- 在瀏覽器 F12 開發者工具 > Network 標籤查看請求詳情
- 檢查是否有 CORS 錯誤

### 2. "404 Not Found"
**原因：**
- 檔案路徑不正確
- 檔案未上傳

**解決：**
- 確認 NAS 上的實際路徑
- 可能需要調整 URL

### 3. "500 Internal Server Error"
**原因：**
- PHP 語法錯誤
- 找不到 config.php
- 資料庫連線失敗

**解決：**
- 查看更新後的錯誤訊息（應該會顯示 JSON 格式的詳細錯誤）

### 4. 資料庫連線失敗
**常見原因：**
- 使用域名 `singchibu.synology.me` 無法從 PHP 解析
- 密碼錯誤
- 資料庫不存在

**解決：**
- 使用 `localhost` 或 `127.0.0.1`（如果 PHP 和 DB 在同一台機器）
- 在 NAS 上使用 phpMyAdmin 測試資料庫連線

---

## 需要上傳到 NAS 的檔案

請確認以下檔案已上傳到 NAS 的 `sammitutorial/backend/` 目錄：

- [x] `test-simple.php` - 簡單 PHP 測試（不需要資料庫）
- [x] `config.php` - 資料庫設定（使用域名）
- [x] `config-localhost.php` - 資料庫設定（使用 localhost）
- [x] `testdb.php` - 資料庫測試（使用域名）
- [x] `testdb-localhost.php` - 資料庫測試（使用 localhost）
- [x] `api.php` - 完整 API 端點

---

## 下一步

1. 先測試 `test-simple.php`，確認 PHP 環境正常
2. 再測試 `testdb-localhost.php`，確認資料庫連線正常
3. 如果都成功，更新 `api-config.js` 使用正確的 URL
4. 推送到 GitHub 並在 GitHub Pages 上測試

請從步驟 1 開始，告訴我每一步的結果，我會協助您排除問題。

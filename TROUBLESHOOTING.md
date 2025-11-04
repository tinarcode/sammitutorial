# 連線問題排除指南

## "Failed to fetch" 錯誤常見原因

### 1. HTTPS/HTTP 混合內容問題

**問題**：GitHub Pages 使用 HTTPS，如果 NAS 使用 HTTP，瀏覽器會阻擋請求。

**解決方案**：
- 在 NAS 上設定 HTTPS（推薦）
- 或使用反向代理（如 Cloudflare）

### 2. CORS 設定問題

**檢查**：
- 確認 `backend/api.php` 和 `backend/testdb.php` 有正確的 CORS 標頭
- 確認 PHP 檔案在請求開始時就輸出 CORS 標頭（在任何輸出之前）

### 3. API URL 路徑錯誤

**檢查**：
- 在瀏覽器直接訪問 API URL：`https://singchibu.synology.me/sammitutorial/backend/testdb.php`
- 應該看到 JSON 回應，而不是 404 錯誤

### 4. NAS Web 伺服器未啟動

**檢查**：
- 登入 NAS 管理介面
- 確認 Web Station 或 Apache/Nginx 正在運行

### 5. PHP 檔案語法錯誤

**檢查**：
- 在 NAS 上直接執行 PHP 檔案
- 檢查錯誤日誌

### 6. 防火牆設定

**檢查**：
- 確認 NAS 防火牆允許外部訪問
- 確認路由器端口轉發設定正確

## 測試步驟

1. **直接訪問 API URL**
   ```
   https://singchibu.synology.me/sammitutorial/backend/testdb.php
   ```
   應該看到 JSON 回應

2. **檢查瀏覽器開發者工具**
   - 按 F12 開啟開發者工具
   - 查看 Console 標籤的錯誤訊息
   - 查看 Network 標籤的請求狀態

3. **檢查 PHP 檔案**
   - 確認檔案已上傳到正確位置
   - 確認檔案權限正確（可讀取）

4. **測試 CORS**
   - 使用 curl 測試：
   ```bash
   curl -H "Origin: https://您的GitHubPages網址" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://singchibu.synology.me/sammitutorial/backend/testdb.php
   ```

## 快速診斷

使用測試頁面的「診斷連線問題」按鈕，會自動檢查：
- API URL 可訪問性
- HTTP 狀態碼
- 連線錯誤詳情

## 常見錯誤訊息對應

- **Failed to fetch**：網路連線問題、CORS 問題、或 URL 錯誤
- **404 Not Found**：檔案路徑錯誤
- **500 Internal Server Error**：PHP 語法錯誤或資料庫連線問題
- **CORS error**：CORS 標頭設定不正確

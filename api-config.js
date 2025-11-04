// API 設定檔
// 指向您的 NAS 上的 PHP API 端點
// 請將此 URL 改為您 NAS 上實際的 API 位置

const API_CONFIG = {
    // 請修改為您 NAS 上的 API URL
    // 範例：https://singchibu.synology.me/api.php
    // 或：http://192.168.0.243/api.php
    baseURL: 'https://singchibu.synology.me/sammitutorial/backend/api.php',
    
    // 測試連線端點
    testURL: 'https://singchibu.synology.me/sammitutorial/backend/testdb.php'
};

// 資料庫 API 函數
const DatabaseAPI = {
    // 測試資料庫連線
    async testConnection() {
        try {
            const response = await fetch(API_CONFIG.testURL, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態：${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('連線錯誤詳情:', error);
            return {
                status: 'error',
                message: '無法連接到 API 伺服器',
                error: error.message,
                url: API_CONFIG.testURL,
                suggestion: '請檢查：1. API URL 是否正確 2. NAS 是否支援 HTTPS 3. CORS 設定是否正確'
            };
        }
    },

    // 執行 SQL 查詢（僅 SELECT）
    async query(sql, params = []) {
        try {
            const response = await fetch(API_CONFIG.baseURL, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sql: sql,
                    params: params
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態：${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('查詢錯誤詳情:', error);
            return {
                status: 'error',
                message: '查詢執行失敗',
                error: error.message,
                url: API_CONFIG.baseURL
            };
        }
    },

    // 簡單的 GET 請求（測試用）
    async test() {
        try {
            const response = await fetch(API_CONFIG.baseURL, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態：${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('測試錯誤詳情:', error);
            return {
                status: 'error',
                message: 'API 請求失敗',
                error: error.message,
                url: API_CONFIG.baseURL
            };
        }
    },
    
    // 診斷連線問題
    async diagnose() {
        const results = {
            url: API_CONFIG.testURL,
            checks: []
        };
        
        // 檢查 1: 嘗試直接訪問 URL
        try {
            const response = await fetch(API_CONFIG.testURL, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            });
            results.checks.push({
                name: 'HTTP 連線',
                status: response.ok ? 'success' : 'error',
                statusCode: response.status,
                message: response.ok ? '連線成功' : `HTTP ${response.status}`
            });
        } catch (error) {
            results.checks.push({
                name: 'HTTP 連線',
                status: 'error',
                message: error.message
            });
        }
        
        return results;
    }
};

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
            const response = await fetch(API_CONFIG.testURL);
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                status: 'error',
                message: '無法連接到 API 伺服器',
                error: error.message
            };
        }
    },

    // 執行 SQL 查詢（僅 SELECT）
    async query(sql, params = []) {
        try {
            const response = await fetch(API_CONFIG.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sql: sql,
                    params: params
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                status: 'error',
                message: '查詢執行失敗',
                error: error.message
            };
        }
    },

    // 簡單的 GET 請求（測試用）
    async test() {
        try {
            const response = await fetch(API_CONFIG.baseURL);
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                status: 'error',
                message: 'API 請求失敗',
                error: error.message
            };
        }
    }
};

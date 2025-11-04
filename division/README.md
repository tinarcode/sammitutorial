# 除法小遊戲 - 二年級數學

## 📝 功能說明

這是一個專為小學二年級學生設計的除法練習遊戲，幫助學生在遊戲中學習除法。

## 🎮 遊戲特色

- **三種難度**：
  - 簡單：除數 2,3,4,5 | 10題
  - 中等：除數 2-9 | 15題
  - 困難：除數 2-12 | 20題

- **記錄系統**：
  - 記錄班級和學號
  - 記錄分數和答題時間
  - 儲存到資料庫供老師查詢

- **友善介面**：
  - 繁體中文介面
  - 大字體，易於閱讀
  - 即時反饋（答對/答錯）
  - 鼓勵性訊息

## 📊 資料庫設定

### 步驟 1：建立資料表

1. 訪問：`https://singchibu.synology.me/sammitutorial/section.html`
2. 複製 `division-game.sql` 的內容
3. 貼到「SQL 建立語句」欄位
4. 將表名稱改為：`division_game_records`
5. 點擊「建立表」

或者使用管理工具直接執行 SQL：
```sql
-- 見 division-game.sql 檔案
```

### 資料表結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INT | 主鍵（自動增長）|
| class | VARCHAR(50) | 班級 |
| student_id | VARCHAR(50) | 學號 |
| score | INT | 分數 |
| total_questions | INT | 總題數 |
| correct_answers | INT | 正確答案數 |
| time_spent | INT | 花費時間（秒）|
| difficulty | VARCHAR(20) | 難度 |
| created_at | TIMESTAMP | 遊戲時間 |

## 🚀 使用方式

### 學生端

1. 訪問遊戲頁面：
   - 本地：`https://singchibu.synology.me/sammitutorial/division/division.html`
   - GitHub Pages：`https://tinarcode.github.io/sammitutorial/division/division.html`

2. 輸入班級和學號

3. 選擇難度

4. 開始遊戲，回答除法問題

5. 遊戲結束後查看成績

### 老師端

查詢學生成績：
```sql
-- 查看某個班級的所有記錄
SELECT * FROM division_game_records 
WHERE class = '二年一班' 
ORDER BY created_at DESC;

-- 查看某個學生的所有記錄
SELECT * FROM division_game_records 
WHERE class = '二年一班' AND student_id = '12345' 
ORDER BY created_at DESC;

-- 查看班級排行榜
SELECT class, student_id, MAX(score) as best_score, COUNT(*) as games_played 
FROM division_game_records 
GROUP BY class, student_id 
ORDER BY best_score DESC 
LIMIT 10;

-- 查看班級平均成績
SELECT class, 
       AVG(score) as avg_score,
       AVG(correct_answers) as avg_correct,
       COUNT(*) as total_games
FROM division_game_records 
GROUP BY class
ORDER BY avg_score DESC;
```

或使用管理工具：
- 訪問：`https://singchibu.synology.me/sammitutorial/manage-table.html`
- 選擇表：`division_game_records`
- 查看所有遊戲記錄

## 📁 檔案結構

```
division/
├── division.html           # 遊戲主頁面
├── division.css            # 遊戲樣式
├── division.js             # 遊戲邏輯
├── division-game.sql       # 資料表 SQL
└── README.md              # 說明文件
```

## 🎯 計分規則

- 每答對一題：+10 分
- 最高分 = 題數 × 10
  - 簡單（10題）：最高 100 分
  - 中等（15題）：最高 150 分
  - 困難（20題）：最高 200 分

## 🌟 鼓勵訊息

根據正確率顯示不同鼓勵：
- 90% 以上：🌟 太厲害了！你是除法小天才！
- 70-89%：👍 做得很好！繼續加油！
- 50-69%：💪 不錯哦！多練習會更進步！
- 50% 以下：😊 沒關係，再試一次會更好！

## 🔧 技術說明

- **前端**：HTML5 + CSS3 + JavaScript
- **後端**：PHP API（已整合到現有系統）
- **資料庫**：MySQL/MariaDB
- **API 端點**：`../backend/api-localhost.php`

## 📝 注意事項

1. 確保資料表已建立
2. 確保 API 可以連接
3. 學生需使用真實班級和學號
4. 建議在電腦或平板上遊玩（更好的體驗）

## 🎨 自訂

可以修改的設定（在 division.js）：
- 難度設定（題數、除數範圍）
- 計分規則
- 鼓勵訊息
- 時間限制（目前未啟用）

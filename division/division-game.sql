-- 除法遊戲資料表 SQL
-- 用於記錄學生的遊戲記錄

-- 建立遊戲記錄表
CREATE TABLE division_game_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class VARCHAR(50) NOT NULL COMMENT '班級',
    student_id VARCHAR(50) NOT NULL COMMENT '學號',
    score INT NOT NULL COMMENT '分數',
    total_questions INT NOT NULL COMMENT '總題數',
    correct_answers INT NOT NULL COMMENT '正確答案數',
    time_spent INT NOT NULL COMMENT '花費時間（秒）',
    difficulty VARCHAR(20) DEFAULT 'easy' COMMENT '難度：easy, medium, hard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '遊戲時間'
) COMMENT='除法遊戲記錄表';

-- 建立索引以加快查詢
CREATE INDEX idx_class_student ON division_game_records(class, student_id);
CREATE INDEX idx_created_at ON division_game_records(created_at);

-- 查詢範例：
-- 查看某個班級的所有記錄
-- SELECT * FROM division_game_records WHERE class = '二年一班' ORDER BY created_at DESC;

-- 查看某個學生的所有記錄
-- SELECT * FROM division_game_records WHERE class = '二年一班' AND student_id = '12345' ORDER BY created_at DESC;

-- 查看班級排行榜（最高分）
-- SELECT class, student_id, MAX(score) as best_score, COUNT(*) as games_played 
-- FROM division_game_records 
-- GROUP BY class, student_id 
-- ORDER BY best_score DESC LIMIT 10;

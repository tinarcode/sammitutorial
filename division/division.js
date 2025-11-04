// 除法遊戲 JavaScript
let gameState = {
    class: '',
    studentId: '',
    difficulty: 'easy',
    mascot: '🐻', // 預設吉祥物
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestion: null,
    startTime: null,
    timeSpent: 0
};

// 難度設定
const difficultySettings = {
    easy: {
        maxDividend: 20,
        divisors: [2, 3, 4, 5],
        totalQuestions: 10,
        timeLimit: 300 // 5分鐘
    },
    medium: {
        maxDividend: 50,
        divisors: [2, 3, 4, 5, 6, 7, 8, 9],
        totalQuestions: 15,
        timeLimit: 420 // 7分鐘
    },
    hard: {
        maxDividend: 100,
        divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        totalQuestions: 20,
        timeLimit: 600 // 10分鐘
    }
};

// API 設定
const API_URL = '../backend/api-localhost.php';

// 開始遊戲
function startGame() {
    const classInput = document.getElementById('classInput').value;
    const studentIdInput = document.getElementById('studentIdInput').value.trim();
    const difficultySelect = document.getElementById('difficultySelect').value;
    
    // 驗證輸入
    if (!classInput) {
        alert('請選擇班級！');
        return;
    }
    
    if (!studentIdInput) {
        alert('請輸入學號！');
        return;
    }
    
    // 初始化遊戲狀態（保留已選擇的吉祥物）
    const selectedMascot = gameState.mascot;
    gameState = {
        class: classInput,
        studentId: studentIdInput,
        difficulty: difficultySelect,
        mascot: selectedMascot,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentQuestion: null,
        startTime: Date.now(),
        timeSpent: 0
    };
    
    // 切換畫面
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    // 更新學生資訊顯示
    document.getElementById('studentInfo').textContent = `${classInput} - ${studentIdInput}`;
    
    // 顯示選擇的吉祥物
    document.getElementById('gameMascot').textContent = gameState.mascot;
    
    // 生成第一題
    generateQuestion();
}

// 生成除法題目
function generateQuestion() {
    const settings = difficultySettings[gameState.difficulty];
    
    // 隨機選擇除數
    const divisor = settings.divisors[Math.floor(Math.random() * settings.divisors.length)];
    
    // 確保結果是整數：先生成商，再計算被除數
    const quotient = Math.floor(Math.random() * (settings.maxDividend / divisor)) + 1;
    const dividend = divisor * quotient;
    
    gameState.currentQuestion = {
        dividend: dividend,
        divisor: divisor,
        answer: quotient
    };
    
    // 顯示題目
    document.getElementById('questionText').textContent = 
        `${dividend} ÷ ${divisor} = ?`;
    
    // 清空答案輸入
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    
    // 隱藏反饋
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('feedback').className = 'feedback';
    
    // 更新題數
    gameState.totalQuestions++;
    updateGameInfo();
}

// 檢查答案
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const correctAnswer = gameState.currentQuestion.answer;
    const feedbackEl = document.getElementById('feedback');
    
    if (isNaN(userAnswer)) {
        alert('請輸入數字！');
        return;
    }
    
    if (userAnswer === correctAnswer) {
        // 答對
        gameState.correctAnswers++;
        gameState.score += 10;
        
        feedbackEl.textContent = '✓ 答對了！真棒！';
        feedbackEl.className = 'feedback correct bounce';
        
        // 播放答對音效（如果有）
        playSound('correct');
    } else {
        // 答錯
        feedbackEl.textContent = `✗ 答錯了！正確答案是 ${correctAnswer}`;
        feedbackEl.className = 'feedback incorrect shake';
        
        // 播放答錯音效（如果有）
        playSound('incorrect');
    }
    
    updateGameInfo();
    
    // 檢查是否完成所有題目
    const settings = difficultySettings[gameState.difficulty];
    if (gameState.totalQuestions >= settings.totalQuestions) {
        setTimeout(endGame, 2000);
    } else {
        setTimeout(generateQuestion, 2000);
    }
}

// 更新遊戲資訊
function updateGameInfo() {
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('questionCount').textContent = 
        `${gameState.totalQuestions} / ${difficultySettings[gameState.difficulty].totalQuestions}`;
    document.getElementById('correctCount').textContent = gameState.correctAnswers;
}

// 結束遊戲
async function endGame() {
    // 計算花費時間
    gameState.timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);
    
    // 切換到結果畫面
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    
    // 顯示結果
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalCorrect').textContent = gameState.correctAnswers;
    document.getElementById('finalTotal').textContent = gameState.totalQuestions;
    document.getElementById('finalAccuracy').textContent = 
        Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) + '%';
    document.getElementById('finalTime').textContent = formatTime(gameState.timeSpent);
    
    // 顯示選擇的吉祥物
    document.getElementById('resultMascot').textContent = gameState.mascot;
    
    // 顯示鼓勵語和星星評分
    const accuracy = gameState.correctAnswers / gameState.totalQuestions;
    let encouragement = '';
    let stars = '';
    
    if (accuracy >= 0.9) {
        encouragement = '🌟 太厲害了！你是除法小天才！';
        stars = '⭐⭐⭐⭐⭐';
    } else if (accuracy >= 0.7) {
        encouragement = '👍 做得很好！繼續加油！';
        stars = '⭐⭐⭐⭐';
    } else if (accuracy >= 0.5) {
        encouragement = '💪 不錯哦！多練習會更進步！';
        stars = '⭐⭐⭐';
    } else if (accuracy >= 0.3) {
        encouragement = '😊 繼續努力！你會越來越棒！';
        stars = '⭐⭐';
    } else {
        encouragement = '🌱 加油！每次練習都是進步！';
        stars = '⭐';
    }
    
    document.getElementById('encouragement').textContent = encouragement;
    document.getElementById('starsRating').textContent = stars;
    
    // 儲存成績到資料庫
    await saveScore();
    
    // 載入班級排行榜
    await loadClassRanking();
}

// 儲存成績到資料庫
async function saveScore() {
    try {
        // 先檢查是否已有相同班級、學號、難度的記錄
        const checkResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql: `SELECT id FROM division_game_records 
                      WHERE class = '${gameState.class}' 
                      AND student_id = '${gameState.studentId}' 
                      AND difficulty = '${gameState.difficulty}'
                      LIMIT 1`
            })
        });
        
        const checkData = await checkResponse.json();
        
        const scoreData = {
            class: gameState.class,
            student_id: gameState.studentId,
            score: gameState.score,
            total_questions: gameState.totalQuestions,
            correct_answers: gameState.correctAnswers,
            time_spent: gameState.timeSpent,
            difficulty: gameState.difficulty,
            mascot: gameState.mascot
        };
        
        let response;
        
        if (checkData.status === 'success' && checkData.data && checkData.data.length > 0) {
            // 已存在記錄，執行更新
            const recordId = checkData.data[0].id;
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    table: 'division_game_records',
                    data: scoreData,
                    where: {
                        id: recordId
                    }
                })
            });
            console.log('更新現有記錄');
        } else {
            // 不存在記錄，執行新增
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'insert',
                    table: 'division_game_records',
                    data: scoreData
                })
            });
            console.log('新增記錄');
        }
        
        const data = await response.json();
        
        if (data.status !== 'success') {
            console.error('儲存成績失敗:', data);
        }
    } catch (error) {
        console.error('儲存成績錯誤:', error);
    }
}

// 載入班級排行榜
async function loadClassRanking() {
    const loadingEl = document.getElementById('rankingLoading');
    const listEl = document.getElementById('rankingList');
    const infoEl = document.getElementById('rankingClassInfo');
    
    try {
        // 顯示載入中
        loadingEl.style.display = 'block';
        listEl.innerHTML = '';
        
        // 更新標題
        const difficultyNames = {
            'easy': '簡單',
            'medium': '中等',
            'hard': '困難'
        };
        infoEl.textContent = `${gameState.class} - ${difficultyNames[gameState.difficulty]}難度排行榜`;
        
        // 查詢同班級同難度的所有記錄
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql: `SELECT student_id, score, correct_answers, total_questions, mascot, created_at
                      FROM division_game_records 
                      WHERE class = '${gameState.class}' 
                      AND difficulty = '${gameState.difficulty}'
                      ORDER BY score DESC, correct_answers DESC, time_spent ASC
                      LIMIT 10`
            })
        });
        
        const data = await response.json();
        
        // 隱藏載入中
        loadingEl.style.display = 'none';
        
        if (data.status === 'success' && data.data && data.data.length > 0) {
            // 顯示排行榜
            data.data.forEach((record, index) => {
                const rank = index + 1;
                const isCurrentUser = record.student_id === gameState.studentId;
                const mascot = record.mascot || '🐻';
                const accuracy = Math.round((record.correct_answers / record.total_questions) * 100);
                
                const itemHTML = `
                    <div class="ranking-item ${isCurrentUser ? 'current-user' : ''}">
                        <div class="ranking-rank ${rank <= 3 ? `rank-${rank}` : ''}">${rank}</div>
                        <div class="ranking-mascot">${mascot}</div>
                        <div class="ranking-info">
                            <div class="ranking-student">
                                ${isCurrentUser ? '👤 ' : ''}學號：${record.student_id}
                                ${isCurrentUser ? ' (你)' : ''}
                            </div>
                            <div class="ranking-details">
                                正確：${record.correct_answers}/${record.total_questions} (${accuracy}%)
                            </div>
                        </div>
                        <div class="ranking-score">${record.score}</div>
                    </div>
                `;
                
                listEl.innerHTML += itemHTML;
            });
        } else {
            // 沒有記錄
            listEl.innerHTML = '<div class="ranking-empty">暫無排行記錄</div>';
        }
    } catch (error) {
        console.error('載入排行榜錯誤:', error);
        loadingEl.style.display = 'none';
        listEl.innerHTML = '<div class="ranking-empty">載入失敗，請稍後再試</div>';
    }
}

// 格式化時間
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} 分 ${secs} 秒`;
}

// 播放音效
function playSound(type) {
    // 可以在這裡添加音效播放
    // 例如使用 Web Audio API 或 HTML5 Audio
}

// 再玩一次
function playAgain() {
    // 保留學生資訊
    const classInput = gameState.class;
    const studentId = gameState.studentId;
    
    // 重置遊戲
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    gameState = {
        class: classInput,
        studentId: studentId,
        difficulty: gameState.difficulty,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentQuestion: null,
        startTime: Date.now(),
        timeSpent: 0
    };
    
    updateGameInfo();
    generateQuestion();
}

// 返回首頁
function backToHome() {
    location.reload();
}

// 查看排行榜
async function viewLeaderboard() {
    alert('排行榜功能開發中...');
    // 可以添加排行榜功能
}

// 鍵盤事件處理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化吉祥物選擇
    initMascotSelection();
    
    // Enter 鍵提交答案
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const gameScreen = document.getElementById('gameScreen');
            if (gameScreen.style.display !== 'none') {
                checkAnswer();
            }
        }
    });
});

// 初始化吉祥物選擇
function initMascotSelection() {
    const mascotOptions = document.querySelectorAll('.mascot-option');
    
    // 預設選擇第一個（小熊）
    if (mascotOptions.length > 0) {
        mascotOptions[0].classList.add('selected');
    }
    
    // 添加點擊事件
    mascotOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有選中狀態
            mascotOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 添加選中狀態
            this.classList.add('selected');
            
            // 更新顯示的吉祥物
            const selectedMascot = this.getAttribute('data-mascot');
            gameState.mascot = selectedMascot;
            document.getElementById('selectedMascot').textContent = selectedMascot;
            
            // 添加彈跳動畫
            const mascotDisplay = document.getElementById('selectedMascot');
            mascotDisplay.style.animation = 'none';
            setTimeout(() => {
                mascotDisplay.style.animation = 'mascotDance 2s ease-in-out infinite';
            }, 10);
        });
    });
}

// 除法遊戲 JavaScript
let gameState = {
    class: '',
    studentId: '',
    difficulty: 'easy',
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
    
    // 初始化遊戲狀態
    gameState = {
        class: classInput,
        studentId: studentIdInput,
        difficulty: difficultySelect,
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
    
    // 顯示鼓勵語
    const accuracy = gameState.correctAnswers / gameState.totalQuestions;
    let encouragement = '';
    if (accuracy >= 0.9) {
        encouragement = '🌟 太厲害了！你是除法小天才！';
    } else if (accuracy >= 0.7) {
        encouragement = '👍 做得很好！繼續加油！';
    } else if (accuracy >= 0.5) {
        encouragement = '💪 不錯哦！多練習會更進步！';
    } else {
        encouragement = '😊 沒關係，再試一次會更好！';
    }
    document.getElementById('encouragement').textContent = encouragement;
    
    // 儲存成績到資料庫
    await saveScore();
}

// 儲存成績到資料庫
async function saveScore() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'insert',
                table: 'division_game_records',
                data: {
                    class: gameState.class,
                    student_id: gameState.studentId,
                    score: gameState.score,
                    total_questions: gameState.totalQuestions,
                    correct_answers: gameState.correctAnswers,
                    time_spent: gameState.timeSpent,
                    difficulty: gameState.difficulty
                }
            })
        });
        
        const data = await response.json();
        
        if (data.status !== 'success') {
            console.error('儲存成績失敗:', data);
        }
    } catch (error) {
        console.error('儲存成績錯誤:', error);
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

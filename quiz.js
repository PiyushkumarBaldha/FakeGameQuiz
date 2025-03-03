let score = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10;

document.getElementById("real-btn").addEventListener("click", () => checkAnswer(true));
document.getElementById("fake-btn").addEventListener("click", () => checkAnswer(false));

function checkAnswer(isReal) {
    if (isReal) score += 10;
    updateScore();
    currentQuestionIndex++;
    updateProgress();

    if (currentQuestionIndex < totalQuestions) {
        updateQuestion();
    } else {
        endQuiz();
    }
}

function updateProgress() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    document.getElementById("progress-bar-filled").style.width = progress + "%";
    document.getElementById("progress-bar-filled").textContent = Math.round(progress) + "%";
}

function updateQuestion() {
    document.querySelector("h2").textContent = "Question " + (currentQuestionIndex + 1);
    document.getElementById("quiz-image").src = "Img/Img" + (currentQuestionIndex + 1) + ".jpg";
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

function getStarRating() {
    return score >= 80 ? "⭐️⭐️⭐️" : score >= 50 ? "⭐️⭐️☆" : "⭐️☆☆";
}

function endQuiz() {
    document.querySelector(".quiz-container").innerHTML = `
        <div class="result-container">
            <h2>Great Job!</h2>
            <p>Your Score: <strong>${score} pts</strong></p>
            <div class="stars">${getStarRating()}</div>
            <button class="play-again" onclick="restartQuiz()">Play Again</button>
        </div>
    `;
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    location.reload();
}

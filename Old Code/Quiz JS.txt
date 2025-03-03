const colors = [ 
    ["#f79c99", "#f7d7d2"],
    ["#a2f7a2", "#d7f7d2"],
    ["#a2a2f7", "#d2d7f7"],
    ["#f7f7a2", "#f7f7c7"],
    ["#a2f7c7", "#d2f7d7"],
    ["#a2c7f7", "#d2d7f7"],
    ["#f7c7a2", "#f7d2c7"],
    ["#c7f7a2", "#d2f7a2"],
    ["#a2a2c7", "#d7d7f7"],
    ["#c7a2f7", "#d2c7f7"],
];

let score = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10;

// Set gradient on page load to make sure the first question has a color
window.onload = function() {
    setGradientBackground(); // Ensure gradient is set at the start
};

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
    // Change background color on every new question
    setGradientBackground();

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

// Function to set a random gradient background (top to bottom, stronger but calm colors)
function setGradientBackground() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const gradient = `linear-gradient(to bottom, ${colors[randomIndex][0]}, ${colors[randomIndex][1]})`;
    document.body.style.background = gradient;
}

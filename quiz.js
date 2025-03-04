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
let imageFolder = "Img"; // Default image folder

// Retrieve form values from localStorage
const userAge = localStorage.getItem("userAge");
const userProfession = localStorage.getItem("userProfession");

// Determine image folder based on age and profession
if (userAge !== null && userProfession !== null) {
    const age = parseInt(userAge);
    if (userProfession !== "engineer") {
        if (age >= 0 && age <= 18) {
            imageFolder = "Img18";
        } else if (age >= 19 && age <= 60) {
            imageFolder = "Img60";
        } else if (age >= 61 && age <= 100) {
            imageFolder = "Img70";
        }
    }
}

// Set gradient on page load
window.onload = function () {
    setGradientBackground();
    updateQuestion();
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
    setGradientBackground();
    document.querySelector("h2").textContent = "Question " + (currentQuestionIndex + 1);
    document.getElementById("quiz-image").src = `${imageFolder}/Img${currentQuestionIndex + 1}.jpg`;
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

// Function to set a random gradient background
function setGradientBackground() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const gradient = `linear-gradient(to bottom, ${colors[randomIndex][0]}, ${colors[randomIndex][1]})`;
    document.body.style.background = gradient;
}

// Define initial score and question index
let score = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10; // Assuming 10 questions

// List of colors for each question's background (linear gradient effect)
const colors = [
    ["#f7b7b7", "#f7f7f7"],
    ["#b7f7b7", "#f7f7f7"],
    ["#b7b7f7", "#f7f7f7"],
    ["#f7f7b7", "#f7f7f7"],
    ["#b7f7d8", "#f7f7f7"],
    ["#b7d8f7", "#f7f7f7"],
    ["#f7d8b7", "#f7f7f7"],
    ["#d8f7b7", "#f7f7f7"],
    ["#b7b7d8", "#f7f7f7"],
    ["#d8b7f7", "#f7f7f7"],
];

// Add event listeners for answer buttons
document.getElementById("real-btn").addEventListener("click", function () {
    checkAnswer(true);
});

document.getElementById("fake-btn").addEventListener("click", function () {
    checkAnswer(false);
});

// Function to check the answer
function checkAnswer(isReal) {
    const correctAnswer = true;

    if (isReal === correctAnswer) {
        score += 10;
    }

    updateScore();
    currentQuestionIndex++;
    updateProgress();

    if (currentQuestionIndex < totalQuestions) {
        updateQuestion();
    } else {
        endQuiz();
    }
}

// Update the progress bar and text
function updateProgress() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    document.getElementById("progress-bar-filled").style.width = progress + "%";
    document.getElementById("progress-bar-filled").textContent = Math.round(progress) + "%";
}

// Update the question and image
function updateQuestion() {
    document.querySelector("h2").textContent = "Question " + (currentQuestionIndex + 1);
    document.getElementById("quiz-image").src = "Img/Img" + (currentQuestionIndex + 1) + ".jpg";

    const gradientColors = colors[currentQuestionIndex];
    document.body.style.background = `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`;
}

// Update score display with animation
function updateScore() {
    const scoreSpan = document.getElementById("score");
    scoreSpan.textContent = score;
    const scoreContainer = document.getElementById("score-container");
    scoreContainer.classList.remove("score-animation");
    void scoreContainer.offsetWidth;  // Trigger reflow for animation reset
    scoreContainer.classList.add("score-animation");
}

// End the quiz and show the final score
function endQuiz() {
    document.querySelector(".quiz-container").innerHTML = `
        <div class="result-container">
            <h2>Nice Work</h2>
            <div class="result-icon">
                <img src="Img/checkmark.png" alt="Success">
            </div>
            <p>You Earned <strong>${score} pts</strong></p>
            <div class="stars">
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star faded">⭐</span>
            </div>
            <button class="play-again" onclick="restartQuiz()">Play Again</button>
        </div>
    `;
}

// Restart Quiz Function - Reset the quiz and redirect to index.html
function restartQuiz() {
    // Reset score and question index
    score = 0;
    currentQuestionIndex = 0;

    // Re-initialize the score and progress
    updateScore();
    updateProgress();
    updateQuestion();

    // Redirect to index.html after resetting
    setTimeout(function () {
        window.location.href = "index.html"; // Ensure redirection happens after reset
    }, 500); // Delay the redirection to allow for reset animations to complete
}

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

// Arrays to store each answer and confidence rating per question
let userAnswers = new Array(totalQuestions).fill(null);
let userConfidence = new Array(totalQuestions).fill(null);

let timerInterval; // Global variable for the countdown timer

// ---------------------------
// Create Navigation and Timer
// ---------------------------
document.addEventListener("DOMContentLoaded", function () {
    // Create navigation container
    const navContainer = document.createElement("div");
    navContainer.id = "question-nav";
    document.body.insertBefore(navContainer, document.body.firstChild);

    // Create navigation buttons with default yellow background (unanswered)
    for (let i = 0; i < totalQuestions; i++) {
        let btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.classList.add("nav-btn");
        btn.style.backgroundColor = "yellow";  // Yellow indicates unanswered
        btn.addEventListener("click", () => goToQuestion(i));
        navContainer.appendChild(btn);
    }

    // Create timer element and insert it after the navigation container
    const timerElement = document.createElement("div");
    timerElement.id = "timer";
    timerElement.style.fontSize = "20px";
    timerElement.style.fontWeight = "bold";
    timerElement.style.marginTop = "10px";
    navContainer.parentNode.insertBefore(timerElement, navContainer.nextSibling);

    // Initialize countdown timer: 10 minutes = 600 seconds
    let totalTime = 600;
    function updateTimer() {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
        totalTime--;
    }
    timerInterval = setInterval(updateTimer, 1000);
});

// ---------------------------
// Navigation and Question Handling
// ---------------------------
function goToQuestion(index) {
    currentQuestionIndex = index;
    updateQuestion();
}

// ---------------------------
// Determine the Image Folder Based on User Data
// ---------------------------
const userAge = localStorage.getItem("userAge");
const userProfession = localStorage.getItem("userProfession");

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

// ---------------------------
// Define Correct Answers for Each Folder
// ---------------------------
const folderCorrectAnswers = {
    "Img":    ["Real", "Fake", "Real", "Fake", "Fake", "Real", "Real", "Fake", "Real", "Fake"],
    "Img18":  ["Fake", "Real", "Fake", "Real", "Real", "Fake", "Fake", "Real", "Fake", "Real"],
    "Img60":  ["Real", "Real", "Fake", "Fake", "Real", "Fake", "Real", "Fake", "Fake", "Real"],
    "Img70":  ["Fake", "Fake", "Real", "Real", "Fake", "Real", "Fake", "Real", "Real", "Fake"]
};
let correctAnswers = folderCorrectAnswers[imageFolder] || folderCorrectAnswers["Img"];

// ---------------------------
// Initialize Question Display
// ---------------------------
window.onload = function () {
    setGradientBackground();
    updateQuestion();
};

// ---------------------------
// Event Listeners for Answer Buttons
// ---------------------------
document.getElementById("real-btn").addEventListener("click", () => checkAnswer(true));
document.getElementById("fake-btn").addEventListener("click", () => checkAnswer(false));

/**
 * Records the answer for the current question and updates the UI.
 * Only records an answer if the question hasn't been answered yet.
 */
function checkAnswer(isReal) {
    // Prevent multiple answers for the same question
    if (userAnswers[currentQuestionIndex] !== null) return;

    // Determine the user's answer as a string
    let userAnswer = isReal ? "Real" : "Fake";
    userAnswers[currentQuestionIndex] = userAnswer;
    
    // Check answer against the correct answer for the current folder
    if (userAnswer === correctAnswers[currentQuestionIndex]) {
        score += 10; // Correct answer: add points
    }
    updateScore();
    markAnswered(currentQuestionIndex);
    updateProgress();

    // Auto-navigate to the next unanswered question, if available
    let nextIndex = findNextUnanswered(currentQuestionIndex);
    if (nextIndex !== -1) {
        currentQuestionIndex = nextIndex;
        updateQuestion();
    } else {
        // All questions answered—end the quiz
        endQuiz();
    }
}

/**
 * Finds the next unanswered question index in a circular order.
 * @param {number} current - The current question index.
 * @returns {number} The next unanswered question index, or -1 if all are answered.
 */
function findNextUnanswered(current) {
    for (let i = current + 1; i < totalQuestions; i++) {
         if (userAnswers[i] === null) return i;
    }
    for (let i = 0; i <= current; i++) {
         if (userAnswers[i] === null) return i;
    }
    return -1;
}

/**
 * Updates the navigation button color based on the answer.
 * Green if correct (matches correctAnswers), red if wrong.
 */
function markAnswered(index) {
    const navButtons = document.querySelectorAll(".nav-btn");
    const button = navButtons[index];
    if (userAnswers[index] === correctAnswers[index]) {
        button.style.backgroundColor = "green";
    } else {
        button.style.backgroundColor = "red";
    }
}

/**
 * Updates the progress bar based on the number of answered questions.
 */
function updateProgress() {
    let answeredCount = userAnswers.filter(answer => answer !== null).length;
    const progress = (answeredCount / totalQuestions) * 100;
    document.getElementById("progress-bar-filled").style.width = progress + "%";
    document.getElementById("progress-bar-filled").textContent = Math.round(progress) + "%";
}

/**
 * Updates the displayed question title and image.
 */
function updateQuestion() {
    setGradientBackground();
    document.querySelector("h2").textContent = "Question " + (currentQuestionIndex + 1);
    document.getElementById("quiz-image").src = `${imageFolder}/Img${currentQuestionIndex + 1}.jpg`;
}

/**
 * Updates the displayed score.
 */
function updateScore() {
    document.getElementById("score").textContent = score;
}

/**
 * Returns a star rating string based on the score.
 */
function getStarRating() {
    return score >= 80 ? "⭐️⭐️⭐️" : score >= 50 ? "⭐️⭐️☆" : "⭐️☆☆";
}

/**
 * Ends the quiz by clearing the timer and displaying the result.
 */
function endQuiz() {
    clearInterval(timerInterval);  // Stop the timer
    document.querySelector(".quiz-container").innerHTML = `
        <div class="result-container">
            <h2>Great Job!</h2>
            <p>Your Score: <strong>${score} pts</strong></p>
            <div class="stars">${getStarRating()}</div>
            <button class="play-again" onclick="restartQuiz()">Play Again</button>
        </div>
    `;
}

/**
 * Restarts the quiz.
 */
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    location.reload();
}

/**
 * Sets a random gradient background for the page.
 */
function setGradientBackground() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const gradient = `linear-gradient(to bottom, ${colors[randomIndex][0]}, ${colors[randomIndex][1]})`;
    document.body.style.background = gradient;
}

// ---------------------------
// Event Listeners for Confidence Buttons
// ---------------------------
document.getElementById("confident-btn").addEventListener("click", function() {
    userConfidence[currentQuestionIndex] = "Confident";
});
document.getElementById("not-sure-btn").addEventListener("click", function() {
    userConfidence[currentQuestionIndex] = "Not Sure";
});
document.getElementById("not-confident-btn").addEventListener("click", function() {
    userConfidence[currentQuestionIndex] = "Not Confident";
});

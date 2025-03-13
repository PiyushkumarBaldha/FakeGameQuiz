// ============================
// Existing Code (Quiz Logic, Navigation, Timer, etc.)
// ============================

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
// Store Quiz Start Time
// ---------------------------
const quizStartTime = Date.now();

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
    if (userAnswers[currentQuestionIndex] !== null) return;
    let userAnswer = isReal ? "Real" : "Fake";
    userAnswers[currentQuestionIndex] = userAnswer;
    
    if (userAnswer === correctAnswers[currentQuestionIndex]) {
        score += 10;
    }
    updateScore();
    markAnswered(currentQuestionIndex);
    updateProgress();

    let nextIndex = findNextUnanswered(currentQuestionIndex);
    if (nextIndex !== -1) {
        currentQuestionIndex = nextIndex;
        updateQuestion();
    } else {
        endQuiz();
    }
}

function findNextUnanswered(current) {
    for (let i = current + 1; i < totalQuestions; i++) {
         if (userAnswers[i] === null) return i;
    }
    for (let i = 0; i <= current; i++) {
         if (userAnswers[i] === null) return i;
    }
    return -1;
}

function markAnswered(index) {
    const navButtons = document.querySelectorAll(".nav-btn");
    const button = navButtons[index];
    if (userAnswers[index] === correctAnswers[index]) {
        button.style.backgroundColor = "green";
    } else {
        button.style.backgroundColor = "red";
    }
}

function updateProgress() {
    let answeredCount = userAnswers.filter(answer => answer !== null).length;
    const progress = (answeredCount / totalQuestions) * 100;
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

/**
 * Ends the quiz by clearing the timer and displaying the result.
 * Shows two buttons: "Finish" and "Play Again".
 */
function endQuiz() {
    clearInterval(timerInterval);
    const quizEndTime = Date.now();
    const timeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);
    
    // Store performance locally
    const quizPerformance = {
        score: score,
        answers: userAnswers,
        confidence: userConfidence,
        timeTaken: timeTaken
    };
    localStorage.setItem("quizPerformance", JSON.stringify(quizPerformance));
    
    // Get or set the user's attempt count (if not set, default to 1)
    let attempt = localStorage.getItem("attempt");
    if (!attempt) {
        attempt = 1;
        localStorage.setItem("attempt", attempt);
    }
    
    // Show result with two buttons: "Finish" and "Play Again"
    document.querySelector(".quiz-container").innerHTML = `
        <div class="result-container">
            <h2>Great Job!</h2>
            <p>Your Score: <strong>${score} pts</strong></p>
            <div class="stars">${getStarRating()}</div>
            <button class="finish-game" onclick="finishGame()">Finish</button>
            <button class="play-again" onclick="playAgain()">Play Again</button>
        </div>
    `;
}

/**
 * Redirects the user to the main index page after sending data.
 */
function finishGame() {
    sendDataToServer().then(() => {
        window.location.href = "index.html"; // Change to your main index file
    });
}

/**
 * Sends the data and then resets the quiz for another attempt.
 * Also updates the attempt variant (e.g. from 1 to 2).
 */
function playAgain() {
    sendDataToServer().then(() => {
        // Increment attempt count (store as a number)
        let attempt = parseInt(localStorage.getItem("attempt") || "1", 10);
        attempt++;
        localStorage.setItem("attempt", attempt);
        // Reload the page to restart the quiz
        window.location.reload();
    });
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

// ---------------------------
// NEW: Function to Send Data to a Common Server Excel File
// ---------------------------
async function sendDataToServer() {
    // Retrieve form data (ensure your form saves these values in localStorage)
    const userId = localStorage.getItem("userId") || "";
    const password = localStorage.getItem("password") || "";
    const userAge = localStorage.getItem("userAge") || "";
    const userProfession = localStorage.getItem("userProfession") || "";
    const status = localStorage.getItem("status") || "";

    // Retrieve quiz performance data
    const storedPerformance = localStorage.getItem("quizPerformance");
    let quizPerformance = {};
    if (storedPerformance) {
        quizPerformance = JSON.parse(storedPerformance);
    }

    // Get the current attempt count and build a variant (e.g., "2.1")
    let attempt = localStorage.getItem("attempt") || "1";
    const variant = attempt + ".1";

    // Build a data object that includes form and quiz performance information
    const data = {
       formData: {
           userId: userId,
           password: password,
           age: userAge,
           profession: userProfession,
           status: status
       },
       quizPerformance: quizPerformance,
       attempt: variant,
       timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch('/submitQuizData', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result.message);
        return result;
    } catch (err) {
        console.error("Error submitting data", err);
        alert("Error submitting data to server.");
    }
}

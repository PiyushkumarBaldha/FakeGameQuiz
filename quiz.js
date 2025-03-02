// Define initial score and question index
let score = 0;
let currentQuestionIndex = 0;
const totalQuestions = 10; // Assuming 10 questions

// List of colors for each question's background (linear gradient effect)
const colors = [
    ["#f7b7b7", "#f7f7f7"], // Example gradient from light pink to white
    ["#b7f7b7", "#f7f7f7"], // Example gradient from light green to white
    ["#b7b7f7", "#f7f7f7"], // Example gradient from light blue to white
    ["#f7f7b7", "#f7f7f7"], // Example gradient from light yellow to white
    ["#b7f7d8", "#f7f7f7"], // Example gradient from light turquoise to white
    ["#b7d8f7", "#f7f7f7"], // Example gradient from light blue to white
    ["#f7d8b7", "#f7f7f7"], // Example gradient from light orange to white
    ["#d8f7b7", "#f7f7f7"], // Example gradient from light lime to white
    ["#b7b7d8", "#f7f7f7"], // Example gradient from light lavender to white
    ["#d8b7f7", "#f7f7f7"], // Example gradient from light purple to white
];

// Add event listeners for answer buttons
document.getElementById("real-btn").addEventListener("click", function() {
    checkAnswer(true);  // Assuming the correct answer is "Real"
});

document.getElementById("fake-btn").addEventListener("click", function() {
    checkAnswer(false);  // Assuming the correct answer is "Fake"
});

// Function to check the answer
function checkAnswer(isReal) {
    // For demonstration, let's assume the correct answer for question 1 is "Real"
    const correctAnswer = true; // Modify this based on your quiz

    if (isReal === correctAnswer) {
        score += 10;  // Add 10 points for correct answer
    }

    // Update score display
    updateScore();

    // Update progress bar
    currentQuestionIndex++;
    updateProgress();

    // Load next question or end quiz
    if (currentQuestionIndex < totalQuestions) {
        // Update question, image, and buttons for next question
        updateQuestion();
    } else {
        // End of quiz, show final score
        endQuiz();
    }
}

// Update the progress bar and text
function updateProgress() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    document.getElementById("progress-bar-filled").style.width = progress + "%";
    document.getElementById("progress-bar-filled").textContent = Math.round(progress) + "%"; // Show percent inside progress bar
}

// Update the question and image (for simplicity, using the same structure)
function updateQuestion() {
    // Update question, image, and background color (linear gradient)
    document.querySelector("h2").textContent = "Question " + (currentQuestionIndex + 1);
    document.getElementById("quiz-image").src = "Img/Img" + (currentQuestionIndex + 1) + ".jpg";

    // Change background color for each new question (linear gradient from top to bottom)
    const gradientColors = colors[currentQuestionIndex];
    document.body.style.background = `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`;
}

// Update score display with animation
function updateScore() {
    const scoreSpan = document.getElementById("score");
    scoreSpan.textContent = score;

    // Trigger the animation by adding/removing a class (or directly using animation in CSS)
    const scoreContainer = document.getElementById("score-container");
    scoreContainer.classList.remove("score-animation");
    void scoreContainer.offsetWidth; // Trigger reflow to restart animation
    scoreContainer.classList.add("score-animation");
}

// End the quiz and show the final score
function endQuiz() {
    document.querySelector("h2").textContent = "Quiz Completed!";
    document.querySelector(".buttons-container").style.display = "none";  // Hide buttons
    document.getElementById("progress-text").textContent = "100%";
}

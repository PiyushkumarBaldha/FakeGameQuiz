// Fetch the score from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const score = urlParams.get('score');

// Display the score on the result page
document.getElementById("final-score").textContent = score;

// Restart button functionality
document.getElementById("restart-btn").addEventListener("click", function() {
    window.location.href = "index.html";  // Redirect to the quiz page to restart the quiz
});

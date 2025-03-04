document.getElementById("submit-btn").addEventListener("click", function(event) {
    // Prevent form submission
    event.preventDefault();

    // Get the required fields
    var profession = document.getElementById("profession");
    var age = document.getElementById("age");

    // Reset the red border or shadow on all fields
    profession.style.boxShadow = '';
    age.style.boxShadow = '';
    profession.style.borderColor = '';
    age.style.borderColor = '';

    // Check if required fields are filled
    var isValid = true;
    var ageValue = parseInt(age.value);

    if (profession.value === "") {
        profession.style.borderColor = "red";
        profession.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
        isValid = false;
    }

    if (age.value === "" || isNaN(ageValue) || ageValue < 0 || ageValue > 100) {
        age.style.borderColor = "red";
        age.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
        isValid = false;
    }

    // If form is valid, store data and redirect
    if (isValid) {
        localStorage.setItem("userAge", ageValue);
        localStorage.setItem("userProfession", profession.value);
        window.location.href = "quiz.html";  // Redirect to quiz page
    }
});

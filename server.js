const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const excelFilePath = path.join(__dirname, 'quiz_data.xlsx');

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Function to read or create an Excel file
function appendDataToExcel(data) {
    const sheetName = "QuizResults";
    let workbook;

    // Check if file exists, if not, create a new one
    if (fs.existsSync(excelFilePath)) {
        workbook = XLSX.readFile(excelFilePath);
    } else {
        workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, ws, 'QuizData');
    }

    const worksheet = workbook.Sheets['Sheet1'] || XLSX.utils.json_to_sheet([]);
    let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']) || [];

    jsonData.push(data); // Add new row to JSON array

    // Convert back to worksheet and write to file
    const newWS = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, newWS, "QuizResults");
    XLSX.writeFile(workbook, excelFilePath);

    console.log("Data written successfully!");
}

// Endpoint to receive quiz data
app.use(bodyParser.json());

app.post('/submitQuizData', (req, res) => {
    try {
        console.log("Received quiz data:", req.body);

        const data = req.body;
        appendDataToExcel(data);

        res.status(200).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving quiz data:", error);
        res.status(500).json({ message: "Error saving quiz data." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

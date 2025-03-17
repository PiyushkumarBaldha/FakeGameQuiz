const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const excelFilePath = path.join(__dirname, 'quiz_data.xlsx');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Function to read or create an Excel file and append data
function appendDataToExcel(data) {
    const sheetName = "QuizResults";
    let workbook;

    // Check if file exists, if not, create a new one
    if (fs.existsSync(excelFilePath)) {
        workbook = XLSX.readFile(excelFilePath);
    } else {
        workbook = XLSX.utils.book_new();
    }

    // Get the worksheet or create a new one
    let worksheet = workbook.Sheets[sheetName];
    let jsonData = [];

    if (worksheet) {
        jsonData = XLSX.utils.sheet_to_json(worksheet);
    } else {
        worksheet = XLSX.utils.json_to_sheet([]);
    }

    // Append new data
    jsonData.push(data);

    // Convert JSON back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
    workbook.Sheets[sheetName] = newWorksheet;
    
    // Write to file
    XLSX.writeFile(workbook, excelFilePath);
    console.log("Data written successfully!");
}

// Endpoint to receive quiz data
app.post('/submitQuizData', (req, res) => {
    try {
        console.log("Received quiz data:", req.body);
        appendDataToExcel(req.body);
        res.status(200).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving quiz data:", error);
        res.status(500).json({ message: "Error saving quiz data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to the common Excel file (relative to where you run the server)
const excelFilePath = 'CommonQuizData.xlsx';

// Function to append a new record to the common Excel file with debug logs
function appendDataToExcel(data) {
    console.log("Received data to append:", data);
    
    let workbook;
    // Check if the Excel file exists
    if (fs.existsSync(excelFilePath)) {
        console.log("Excel file exists. Reading file...");
        workbook = XLSX.readFile(excelFilePath);
    } else {
        console.log("Excel file does not exist. Creating a new workbook...");
        workbook = XLSX.utils.book_new();
    }
    
    const sheetName = "QuizData";
    let worksheet;
    if (workbook.Sheets[sheetName]) {
        console.log("Worksheet '" + sheetName + "' exists. Reading sheet...");
        worksheet = workbook.Sheets[sheetName];
    } else {
        console.log("Worksheet '" + sheetName + "' does not exist. Creating a new sheet...");
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
    
    // Convert existing worksheet data to JSON
    const existingData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Existing data in sheet:", existingData);
    
    // Append the new record
    existingData.push(data);
    console.log("New data array:", existingData);
    
    // Convert the JSON data back to a worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(existingData);
    workbook.Sheets[sheetName] = newWorksheet;
    
    // Write the updated workbook back to disk
    XLSX.writeFile(workbook, excelFilePath);
    console.log("Data written to Excel file successfully.");
}

// Endpoint to receive quiz data from the client
app.post('/submitQuizData', (req, res) => {
    console.log("POST /submitQuizData called");
    const quizData = req.body;
    try {
        appendDataToExcel(quizData);
        res.status(200).send({ message: 'Data saved successfully to common Excel file!' });
    } catch (error) {
        console.error("Error in appending data to Excel file:", error);
        res.status(500).send({ message: 'Error saving data to Excel file.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

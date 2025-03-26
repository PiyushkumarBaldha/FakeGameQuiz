const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const csvFilePath = path.join(__dirname, 'quiz_data.csv');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Save data to CSV
function appendDataToCSV(data) {
  const headers = Object.keys(data);
  const row = headers.map(header => {
    let value = data[header];
    // Convert arrays to strings
    if (Array.isArray(value)) {
      value = value.join(';');
    }
    // Escape commas and quotes
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',');

  // Write headers if file is new/empty
  if (!fs.existsSync(csvFilePath) || fs.statSync(csvFilePath).size === 0) {
    fs.writeFileSync(csvFilePath, headers.join(',') + '\n');
  }

  // Append the data row
  fs.appendFileSync(csvFilePath, row + '\n');
  console.log("Data saved to CSV!");
}

app.post('/submitQuizData', (req, res) => {
  try {
    console.log("Received data:", req.body);
    appendDataToCSV(req.body);
    res.status(200).json({ message: "Data saved!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error saving data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
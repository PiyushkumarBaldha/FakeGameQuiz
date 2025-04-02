const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const quizCsvPath = path.join(__dirname, 'quiz_data.csv');
const otherCsvPath = path.join(__dirname, 'after_Quiz_data.csv');

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Track user sessions and play counts
const userSessions = new Map();

// Generic CSV append function
function appendToCSV(filePath, headers, data) {
  const row = headers.map(header => {
    let value = data[header];
    if (Array.isArray(value)) {
      value = value.join(';');
    }
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value || '';
  }).join(',');

  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    fs.writeFileSync(filePath, headers.join(',') + '\n');
  }

  fs.appendFileSync(filePath, row + '\n');
  console.log(`Data saved to ${path.basename(filePath)}!`);
}

function getNextSessionId() {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
}

// Handle quiz data
app.post('/submitQuizData', (req, res) => {
  try {
    const { age, profession } = req.body;
    const userKey = `${age}-${profession}`;
    
    if (!userSessions.has(userKey)) {
      userSessions.set(userKey, {
        sessionId: getNextSessionId(),
        playCount: 0
      });
    }

    const sessionInfo = userSessions.get(userKey);
    sessionInfo.playCount += 1;
    
    const csvData = {
      ...req.body,
      sessionId: sessionInfo.sessionId,
      playNumber: `${sessionInfo.sessionId.split('-')[1]}.${sessionInfo.playCount - 1}`
    };

    const quizHeaders = [
      'sessionId',
      'playNumber',
      'timestamp',
      'age',
      'profession',
      'score',
      'answers',
      'confidence',
      'timeTaken'
    ];

    appendToCSV(quizCsvPath, quizHeaders, csvData);
    res.status(200).json({ message: "Quiz data saved!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error saving quiz data." });
  }
});

// Handle other data (from your second JS file)
app.post('/submitOtherData', (req, res) => {
  try {
    const otherHeaders = [
      'timestamp',
      'userId',
      'feedback',
      'rating'
    ];

    const csvData = {
      timestamp: new Date().toISOString(),
      userId: req.body.userId || 'anonymous',
      feedback: req.body.feedback || '',
      rating: req.body.rating || 0
    };

    appendToCSV(otherCsvPath, otherHeaders, csvData);
    res.status(200).json({ message: "Other data saved!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error saving other data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
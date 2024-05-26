// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Serve static files
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cors());

const countries = [
  "afghanistan", "albania", "algeria", "andorra", "angola", "antigua and barbuda", // Add more countries as needed
  // You can find a complete list of countries online or use an API to fetch them dynamically
];

let timer;

// Endpoint to start a single-player game with countries as the category
app.post('/single-player/start', (req, res) => {
  clearInterval(timer);
  startTimer();
  res.json({ message: 'Game started!' });
});

// Endpoint to stop the game
app.post('/single-player/stop', (req, res) => {
  clearInterval(timer);
  res.json({ message: 'Game stopped!' });
});

// Endpoint to check the list of countries and calculate the score
app.post('/single-player/score', (req, res) => {
  const { countriesList } = req.body;
  const score = calculateScore(countriesList);
  res.json({ score });
});

// Endpoint to get the list of valid countries
app.get('/countries', (req, res) => {
  res.json({ countries });
});


// Helper function to start the timer
function startTimer() {
  timer = setTimeout(() => {
    clearInterval(timer);
  }, 60000); // 1 minute
}

// Helper function to calculate the score
function calculateScore(countriesList) {
  if (!Array.isArray(countriesList)) {
    return 0; // Ensure countriesList is an array
  }
  const validCountries = countries.filter(country => countriesList.includes(country));
  return validCountries.length;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

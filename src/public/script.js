// script.js
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const scoreDisplay = document.getElementById('score');
  const countriesList = document.getElementById('countriesList');
  const countryInput = document.getElementById('countryInput');
  const addCountryBtn = document.getElementById('addCountryBtn');
  const timerDisplay = document.getElementById('timerDisplay');

  let timer;
  let remainingTime = 60; // Initial time in seconds
  let gameStarted = false;
  let validCountries = [];

  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click', stopGame);
  addCountryBtn.addEventListener('click', addCountry);

  // Fetch the list of valid countries on page load
  fetch('http://localhost:3000/countries')
    .then(response => response.json())
    .then(data => {
      validCountries = data.countries.map(country => country.toLowerCase());
    });

  function startGame() {
    if (gameStarted) {
      return;
    }
    fetch('http://localhost:3000/single-player/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      resetGame();
      startTimer();
      gameStarted = true;
      countriesList.style.display = 'none';
    });
  }

  function stopGame() {
    clearInterval(timer);
    fetch('http://localhost:3000/single-player/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      calculateScore();
      gameStarted = false;
      countriesList.style.display = 'initial';
    });
  }

  function addCountry() {
    if (!gameStarted) {
      return;
    }
    const country = countryInput.value.trim().toLowerCase();
    if (country !== '') {
      if (!validCountries.includes(country) || isDuplicate(country)) {
        stopGame();
        return;
      }
      const countryItem = document.createElement('div');
      countryItem.textContent = countryInput.value.trim();
      countriesList.appendChild(countryItem);
      countryInput.value = '';
      calculateScore();
    }
  }

  function isDuplicate(country) {
    return Array.from(countriesList.children).some(item => item.textContent.toLowerCase() === country);
  }

  function clearCountriesList() {
    countriesList.innerHTML = ''; // Clear countries list
  }

  function updateScore(score) {
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
  }

  function calculateScore() {
    const countries = Array.from(countriesList.children).map(country => country.textContent.toLowerCase());
    fetch('http://localhost:3000/single-player/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ countriesList: countries })
    })
    .then(response => response.json())
    .then(data => {
      updateScore(data.score); // Update score display
    });
  }

  function resetGame() {
    remainingTime = 60; // Reset remainingTime to initial value
    timerDisplay.textContent = remainingTime; // Update timer display
    clearCountriesList(); // Clear countries list
    updateScore(0); // Reset score display
  }

  function startTimer() {
    timer = setInterval(() => {
      remainingTime--;
      timerDisplay.textContent = remainingTime; // Update timer display
      if (remainingTime <= 0) {
        clearInterval(timer);
        stopGame();
      }
    }, 1000); // 1 second interval
  }
});

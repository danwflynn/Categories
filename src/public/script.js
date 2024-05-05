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

  startBtn.addEventListener('click', () => {
    startGame();
  });

  stopBtn.addEventListener('click', () => {
    stopGame();
  });

  addCountryBtn.addEventListener('click', () => {
    addCountry();
  });

  function startGame() {
    fetch('http://localhost:3000/single-player/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      remainingTime = 60; // Reset remainingTime to initial value
      timerDisplay.textContent = remainingTime; // Update timer display
      clearCountriesList(); // Clear countries list
      updateScore(0); // Reset score display
      timer = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = remainingTime; // Update timer display
        if (remainingTime <= 0) {
          clearInterval(timer);
          stopGame();
        }
      }, 1000); // 1 second interval
      gameStarted = true;
      countriesList.style.display = 'none'
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
      countriesList.style.display = 'initial'
    });
  }

  function addCountry() {
    if (!gameStarted) {
      return;
    }
    const country = countryInput.value.trim();
    if (country !== '') {
      const countryItem = document.createElement('div');
      countryItem.textContent = country;
      countriesList.appendChild(countryItem);
      countryInput.value = '';
      calculateScore();
    }
  }

  function clearCountriesList() {
    countriesList.innerHTML = ''; // Clear countries list
  }

  function updateScore(score) {
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
  }

  function calculateScore() {
    const countries = Array.from(countriesList.children).map(country => country.textContent);
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
});

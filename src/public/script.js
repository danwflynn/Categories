// script.js
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const scoreDisplay = document.getElementById('score');
  const countriesList = document.getElementById('countriesList');
  const countryInput = document.getElementById('countryInput');
  const addCountryBtn = document.getElementById('addCountryBtn');

  let timer;

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
      timer = setInterval(() => {
        clearInterval(timer);
        stopGame();
      }, 60000); // 1 minute
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
    });
  }

  function addCountry() {
    const country = countryInput.value.trim();
    if (country !== '') {
      const countryItem = document.createElement('div');
      countryItem.textContent = country;
      countriesList.appendChild(countryItem);
      countryInput.value = '';
    }
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
      scoreDisplay.textContent = `Score: ${data.score}`;
    });
  }
});

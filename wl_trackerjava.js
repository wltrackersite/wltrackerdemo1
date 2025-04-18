document.addEventListener("DOMContentLoaded", () => {
  let playerNames = [];
  let matchHistory = [];
  let currentMatchIndex = 0; // Az aktuális meccs indexe

  fetch('player_names.json')
    .then(response => response.json())
    .then(data => {
      playerNames = data;
      setupAutocomplete();
    });

  document.getElementById('matchForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Megerősítő ablak megjelenítése
    const confirmSave = confirm("Biztosan menteni szeretnéd a meccs adatait?");
    if (!confirmSave) return;

    // Meccs adatok mentése
    const result = document.querySelector('input[name="result"]:checked')?.value;
    console.log(result); // "win" vagy "loss"
    const players = [];
    document.querySelectorAll('.player-row').forEach(row => {
      const name = row.querySelector('.player-select').value;
      const goals = parseInt(row.querySelector('.goal-input')?.value || 0);
      if (name) players.push({ name, goals });
    });

    const match = { index: currentMatchIndex, result, players, locked: true };
    matchHistory[currentMatchIndex] = match;

    // Az aktuális meccs lezárása
    lockMatchForm();
    lockMatchButton(currentMatchIndex);

    // Következő meccs gomb elérhetővé tétele
    currentMatchIndex++;
    unlockMatchButton(currentMatchIndex);

    // Automatikusan a következő meccsre ugrás
    clearMatchForm();
  });

  function lockMatchForm() {
    // A "WL Stat" rész mezőinek letiltása
    document.querySelectorAll('#matchForm input, #matchForm select, #matchForm button').forEach(element => {
      element.disabled = true;
    });
  }

  function unlockMatchButton(index) {
    const button = document.querySelector(`.match-button:nth-child(${index + 1})`);
    if (button) {
      button.disabled = false; // Gomb engedélyezése
      button.classList.remove('locked'); // Stílus eltávolítása
    }
  }

  function clearMatchForm() {
    // Form visszaállítása az új meccshez
    document.getElementById('matchForm').reset();
    document.querySelector('#playersSection').innerHTML = `
      <h2>⚽ Gólszerzők</h2>
      <div class="player-row">
        <div class="player-select-container">
          <input type="text" class="player-select" placeholder="Játékos neve">
          <span class="clear-btn" style="display: none;">❌</span>
          <div class="autocomplete-list"></div>
        </div>
      </div>`;
    setupAutocomplete();

    // A form mezőit újra engedélyezzük
    document.querySelectorAll('#matchForm input, #matchForm select, #matchForm button').forEach(element => {
      element.disabled = false;
    });
  }

  function loadMatchToForm(index) {
    const match = matchHistory[index];

    if (match && match.locked) {
      // A mentett adatok betöltése a formba
      document.getElementById('result').value = match.result;

      const playersSection = document.getElementById('playersSection');
      playersSection.innerHTML = `
        <h2>⚽ Gólszerzők</h2>
      `;

      match.players.forEach(player => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.innerHTML = `
          <div class="player-select-container">
            <input type="text" class="player-select" value="${player.name}" placeholder="Játékos neve" disabled>
            <input type="number" class="goal-input" value="${player.goals}" disabled>
          </div>`;
        playersSection.appendChild(row);
      });

      // A form mezőit letiltjuk, hogy ne lehessen szerkeszteni
      document.querySelectorAll('#matchForm input, #matchForm select, #matchForm button').forEach(element => {
        element.disabled = true;
      });
    } else {
      // Ha a meccs nincs mentve, akkor üres form jelenjen meg, és legyen szerkeszthető
      clearMatchForm();
    }
  }

  // Az oldal betöltésekor csak az első meccs gomb legyen elérhető
  const buttons = document.querySelectorAll('.match-button');
  buttons.forEach((button, index) => {
    if (index === 0) {
      button.disabled = false; // Az első gomb engedélyezése
    } else {
      button.disabled = true; // A többi gomb letiltása
    }

    // Gomb kattintásra a megfelelő meccs adatainak betöltése
    button.addEventListener('click', () => {
      loadMatchToForm(index);
    });
  });

  // Hazai pontszám növelése és csökkentése
  const homeScoreDisplay = document.querySelector(".team-score:nth-of-type(1) .score-display");
  const homeIncrementButton = document.querySelector(".team-score:nth-of-type(1) .increment");
  const homeDecrementButton = document.querySelector(".team-score:nth-of-type(1) .decrement");

  let homeScore = 0; // Kezdőérték számként

  homeIncrementButton.addEventListener("click", () => {
    homeScore += 1; // Növeljük az értéket
    homeScoreDisplay.textContent = homeScore; // Frissítjük a DOM-ban
  });

  homeDecrementButton.addEventListener("click", () => {
    if (homeScore > 0) {
      homeScore -= 1; // Csökkentjük az értéket, ha nagyobb, mint 0
      homeScoreDisplay.textContent = homeScore; // Frissítjük a DOM-ban
    }
  });

  // Vendég pontszám növelése és csökkentése
  const awayScoreDisplay = document.querySelector(".team-score:nth-of-type(2) .score-display");
  const awayIncrementButton = document.querySelector(".team-score:nth-of-type(2) .increment");
  const awayDecrementButton = document.querySelector(".team-score:nth-of-type(2) .decrement");

  let awayScore = 0; // Kezdőérték számként

  awayIncrementButton.addEventListener("click", () => {
    awayScore += 1; // Növeljük az értéket
    awayScoreDisplay.textContent = awayScore; // Frissítjük a DOM-ban
  });

  awayDecrementButton.addEventListener("click", () => {
    if (awayScore > 0) {
      awayScore -= 1; // Csökkentjük az értéket, ha nagyobb, mint 0
      awayScoreDisplay.textContent = awayScore; // Frissítjük a DOM-ban
    }
  });
});

function lockMatchButton(index) {
  const button = document.querySelector(`.match-button:nth-child(${index + 1})`);
  if (button) {
    button.classList.add('locked'); // Stílus hozzáadása
  }
}

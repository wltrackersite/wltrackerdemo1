window.onload = function () {
  document.getElementById("saveMatchButton").addEventListener("click", function () {
    location.href = "wl_meccsek.html";
  });

  document.getElementById("saveMatchButton").addEventListener("click", function () {
    console.log("Mentés gombra kattintottak.");

    // Megerősítő ablak
    const confirmSave = confirm("Biztosan menteni szeretnéd a meccs eredményét?");
    console.log("confirmSave értéke:", confirmSave);

    if (confirmSave) {
      console.log("Mentés megerősítve.");

      // Adatok begyűjtése
      const result = document.querySelector('input[name="result"]:checked')?.value;
      const homeScore = document.querySelector(".team-score:nth-child(1) .score-display").textContent;
      const awayScore = document.querySelector(".team-score:nth-child(2) .score-display").textContent;

      console.log("Eredmény:", result, "Hazai:", homeScore, "Vendég:", awayScore);

      if (!result || !homeScore || !awayScore) {
        alert("Kérlek, töltsd ki az összes mezőt!");
        return;
      }

      // Adatok mentése helyi tárolóba (localStorage)
      const matchId = sessionStorage.getItem("currentMatchId"); // Az aktuális meccs azonosítója
      const matchData = {
        result: result,
        homeScore: homeScore,
        awayScore: awayScore,
        isEditable: false, // Jelzi, hogy a meccs már nem szerkeszthető
      };

      localStorage.setItem(`match_${matchId}`, JSON.stringify(matchData));

      console.log("Adatok mentve a localStorage-ba:", matchData);

      // Felugró üzenet
      alert("A meccs eredménye sikeresen mentve!");

      // Átirányítás a wl_meccsek.html oldalra
      console.log("Átirányítás a wl_meccsek.html oldalra.");
      location.href = "/wl_meccsek.html";
    } else {
      // Ha a felhasználó a "Mégse" gombra kattint, semmi nem történik
      alert("A mentés megszakítva. Az adatok érintetlenek maradtak.");
    }
  });

  document.getElementById("saveMatchButton").addEventListener("click", function () {
    const confirmSave = confirm("Biztosan menteni szeretnéd a meccs eredményét?");
    if (confirmSave) {
      const result = document.querySelector('input[name="result"]:checked')?.value;
      const homeScore = document.querySelector(".team-score:nth-child(1) .score-display").textContent;
      const awayScore = document.querySelector(".team-score:nth-child(2) .score-display").textContent;

      if (!result || !homeScore || !awayScore) {
        alert("Kérlek, töltsd ki az összes mezőt!");
        return;
      }

      // Adatok mentése helyi tárolóba (localStorage)
      const matchId = sessionStorage.getItem("currentMatchId");
      const matchData = {
        result: result,
        homeScore: homeScore,
        awayScore: awayScore,
        isEditable: false, // A meccs már nem szerkeszthető
      };

      localStorage.setItem(`match_${matchId}`, JSON.stringify(matchData));

      alert("A meccs eredménye sikeresen mentve!");
      location.href = "/wl_meccsek.html";
    }
  });

  // Mentett meccsek betöltése
  const matchListContainer = document.querySelector(".match-list");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("match_")) {
      const matchData = JSON.parse(localStorage.getItem(key));

      // Meccs megjelenítése
      const matchButton = document.createElement("button");
      matchButton.className = "match-button";
      matchButton.textContent = `Meccs: ${matchData.homeScore} - ${matchData.awayScore}`;

      // Ha a meccs már mentve van, letiltjuk a szerkesztést
      if (!matchData.isEditable) {
        matchButton.disabled = true;
      }

      matchListContainer.appendChild(matchButton);
    }
  }

  document.querySelectorAll(".increment-decrement-buttons").forEach((container) => {
    const decrementButton = container.querySelector(".decrement");
    const incrementButton = container.querySelector(".increment");
    const scoreDisplay = container.querySelector(".score-display");

    // Növelés
    incrementButton.addEventListener("click", () => {
      let currentScore = parseInt(scoreDisplay.textContent, 10);
      scoreDisplay.textContent = currentScore + 1;
    });

    // Csökkentés
    decrementButton.addEventListener("click", () => {
      let currentScore = parseInt(scoreDisplay.textContent, 10);
      if (currentScore > 0) {
        scoreDisplay.textContent = currentScore - 1;
      }
    });
  });

  let playerNames = [];

  // JSON fájl betöltése
  fetch('player_names.json')
    .then(response => response.json())
    .then(data => {
      playerNames = data;
    })
    .catch(error => console.error('Hiba a JSON betöltésekor:', error));

  // Keresőmező eseménykezelő hozzáadása egy adott mezőhöz
  function addSearchEvent(inputElement, autocompleteList) {
    inputElement.addEventListener('input', function () {
      const query = this.value.toLowerCase();

      // Töröljük az előző találatokat
      autocompleteList.innerHTML = '';

      if (query) {
        // Szűrés a játékosnevekre
        const filteredNames = playerNames.filter(name => name.toLowerCase().includes(query));

        // Találatok megjelenítése
        filteredNames.forEach(name => {
          const listItem = document.createElement('li');
          listItem.textContent = name;

          // Kattintás esemény a találatokra
          listItem.addEventListener('click', function () {
            inputElement.value = name;
            autocompleteList.innerHTML = ''; // Lista törlése
          });

          autocompleteList.appendChild(listItem);
        });
      }
    });
  }

  // Eseménykezelő a "Játékos hozzáadása" gombhoz
  document.getElementById('addPlayerButton').addEventListener('click', function () {
    const playersSection = document.getElementById('playersSection');

    // Új játékos kereső mező létrehozása
    const playerRow = document.createElement('div');
    playerRow.className = 'player-row';

    const playerSearch = document.createElement('div');
    playerSearch.className = 'player-search';

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.className = 'playerSearchInput';
    inputElement.placeholder = 'Játékos neve';

    const clearButton = document.createElement('span');
    clearButton.className = 'clear-btn';
    clearButton.textContent = '❌';

    const autocompleteList = document.createElement('ul');
    autocompleteList.className = 'autocomplete-list';

    // Eseménykezelő hozzáadása az új mezőhöz
    addSearchEvent(inputElement, autocompleteList);

    // Az "X" gomb megjelenítése, ha van szöveg a mezőben
    inputElement.addEventListener('input', () => {
      if (inputElement.value.trim() !== '') {
        clearButton.style.display = 'block';
      } else {
        clearButton.style.display = 'none';
      }
    });

    // Az "X" gombra kattintva töröljük a mező tartalmát
    clearButton.addEventListener('click', () => {
      inputElement.value = '';
      clearButton.style.display = 'none';
      autocompleteList.innerHTML = ''; // Az automatikus kiegészítés lista törlése
    });

    // Az elemek összekapcsolása
    playerSearch.appendChild(inputElement);
    playerSearch.appendChild(clearButton);
    playerSearch.appendChild(autocompleteList);
    playerRow.appendChild(playerSearch);

    // Új mező hozzáadása a gólszerzők szekcióhoz
    playersSection.insertBefore(playerRow, document.getElementById('addPlayerButton'));
  });

  // Alapértelmezett keresőmező eseménykezelője
  const defaultInput = document.querySelector('.playerSearchInput');
  const defaultClearButton = document.querySelector('.clear-btn');
  const defaultAutocompleteList = document.querySelector('.autocomplete-list');

  // Az "X" gomb megjelenítése az alapértelmezett mezőben
  defaultInput.addEventListener('input', () => {
    if (defaultInput.value.trim() !== '') {
      defaultClearButton.style.display = 'block';
    } else {
      defaultClearButton.style.display = 'none';
    }

    // Automatikus kiegészítés frissítése
    const query = defaultInput.value.toLowerCase();
    defaultAutocompleteList.innerHTML = ''; // Töröljük az előző találatokat

    if (query) {
      const filteredNames = playerNames.filter(name => name.toLowerCase().includes(query));
      filteredNames.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;

        // Kattintás esemény a találatokra
        listItem.addEventListener('click', () => {
          defaultInput.value = name;
          defaultAutocompleteList.innerHTML = ''; // Lista törlése
          defaultClearButton.style.display = 'block';
        });

        defaultAutocompleteList.appendChild(listItem);
      });
    }
  });

  // Az "X" gombra kattintva töröljük az alapértelmezett mező tartalmát
  defaultClearButton.addEventListener('click', () => {
    defaultInput.value = '';
    defaultClearButton.style.display = 'none';
    defaultAutocompleteList.innerHTML = ''; // Az automatikus kiegészítés lista törlése
  });

  document.querySelectorAll('.player-search').forEach(playerSearch => {
    const inputElement = playerSearch.querySelector('.playerSearchInput');
    const clearButton = playerSearch.querySelector('.clear-btn');

    // Az "X" gomb megjelenítése, ha van szöveg a mezőben
    inputElement.addEventListener('input', () => {
      if (inputElement.value.trim() !== '') {
        clearButton.style.display = 'block';
      } else {
        clearButton.style.display = 'none';
      }
    });

    // Az "X" gombra kattintva töröljük a mező tartalmát
    clearButton.addEventListener('click', () => {
      inputElement.value = '';
      clearButton.style.display = 'none';
      const autocompleteList = playerSearch.querySelector('.autocomplete-list');
      autocompleteList.innerHTML = ''; // Az automatikus kiegészítés lista törlése
    });
  });
};

document.getElementById("saveMatchButton").addEventListener("click", function () {
  const confirmSave = confirm("Biztosan menteni szeretnéd a meccs eredményét?");
  if (confirmSave) {
    const result = document.querySelector('input[name="result"]:checked')?.value;
    const homeScore = document.querySelector(".team-score:nth-child(1) .score-display").textContent;
    const awayScore = document.querySelector(".team-score:nth-child(2) .score-display").textContent;

    if (!result || !homeScore || !awayScore) {
      alert("Kérlek, töltsd ki az összes mezőt!");
      return;
    }

    // Adatok mentése helyi tárolóba (localStorage)
    const matchId = sessionStorage.getItem("currentMatchId");
    const matchData = {
      result: result,
      homeScore: homeScore,
      awayScore: awayScore,
      isEditable: false, // A meccs már nem szerkeszthető
    };

    localStorage.setItem(`match_${matchId}`, JSON.stringify(matchData));

    alert("A meccs eredménye sikeresen mentve!");
    location.href = "/wl_meccsek.html";
  }
});

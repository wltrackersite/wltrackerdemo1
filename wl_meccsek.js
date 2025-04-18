// URL-paraméterek kiolvasása
const urlParams = new URLSearchParams(window.location.search);
const matchNumber = urlParams.get('match');

// Megjeleníti a meccs számát
if (matchNumber) {
  document.getElementById('matchDetails').textContent = `A(z) ${matchNumber}. meccs statisztikái jelennek meg itt.`;
}

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

    // Ha a meccs már nem szerkeszthető, letiltjuk a gombot
    if (!matchData.isEditable) {
      matchButton.disabled = true;
      matchButton.classList.add("disabled"); // Opcionális: stílus hozzáadása
    }

    // Meccs kiválasztása
    matchButton.addEventListener("click", () => {
      if (matchData.isEditable) {
        sessionStorage.setItem("currentMatchId", key.replace("match_", ""));
        location.href = "/wl_stat.html";
      } else {
        alert("Ez a meccs már nem szerkeszthető, csak megtekinthető.");
      }
    });

    matchListContainer.appendChild(matchButton);
  }
}
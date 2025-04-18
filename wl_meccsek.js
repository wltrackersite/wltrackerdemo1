// URL-paraméterek kiolvasása
const urlParams = new URLSearchParams(window.location.search);
const matchNumber = urlParams.get('match');

// Megjeleníti a meccs számát
if (matchNumber) {
  document.getElementById('matchDetails').textContent = `A(z) ${matchNumber}. meccs statisztikái jelennek meg itt.`;
}
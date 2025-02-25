export let currentLeague = null;

export const LEAGUES = {
  OPEN: "Open League",
  ROOKIE: "Rookie League",
};

export async function loadGameData(filename) {
  const response = await fetch(filename);
  const data = await response.json();

  currentLeague = data.league;

  const leagueNameElement = document.getElementById("league-name");
  if (leagueNameElement) {
    leagueNameElement.textContent = currentLeague;
  }

  return data;
}

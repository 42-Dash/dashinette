/**
 * @class LeaderboardController
 * @brief Manages leaderboard updates based on game data.
 */
export default class LeaderboardController {
  constructor(gameData, leaderboard) {
    this._gameData = gameData;
    this._leaderboardComponent = leaderboard;
  }

  showCurrentPoints() {
    this._leaderboardComponent.showCurrentPoints();
  }

  hideCurrentPoints() {
    this._leaderboardComponent.hideCurrentPoints();
  }

  renderDefaultLeaderboard() {
    this._leaderboardComponent.hideCurrentPoints();
    this._leaderboardComponent.loadRanking(
      this._gameData.getGroups().map((group) => {
        return {
          name: group.name,
          total_score: 0,
          current_points: 0,
          status: "valid",
          colour: this._gameData.getColorByGroupName(group.name),
        };
      }),
    );
  }

  renderLeaderboard() {
    const ranking = this._gameData.getGroups().map((group, index) => ({
      name: group.name,
      total_score: this.#calcTotalGroupScore(index),
      current_points: group.score,
      status: group.status,
      colour: this._gameData.getColorByGroupName(group.name),
    }));

    ranking.sort((a, b) => b.total_score - a.total_score);

    this._leaderboardComponent.loadRanking(ranking);
    this._leaderboardComponent.showCurrentPoints();
  }

  #calcTotalGroupScore(index) {
    return Array.from(
      { length: this._gameData.getLevel() + 1 },
      (_, level) => this._gameData.getGroupByIndex(index, level).score,
    ).reduce((a, b) => a + b, 0);
  }
}

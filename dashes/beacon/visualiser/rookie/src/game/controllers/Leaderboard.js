export default class LeaderboardController {
  constructor(gameData, leaderboard) {
    this._gameData = gameData;
    this._leaderboard = leaderboard;
  }

  showCurrentPoints() {
    this._leaderboard.showCurrentPoints();
  }

  hideCurrentPoints() {
    this._leaderboard.hideCurrentPoints();
  }

  renderDefaultLeaderboard() {
    this._leaderboard.hideCurrentPoints();
    this._leaderboard.loadRanking(
      this._gameData.getGroups().map((group, _) => {
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
    const ranking = [];

    this._gameData.getGroups().forEach((group, index) => {
      let total_score = 0;
      for (let level = 0; level <= this._gameData.getLevel(); level++) {
        total_score += this._gameData.getGroupByIndex(index, level).score;
      }
      ranking.push({
        name: group.name,
        total_score: total_score,
        current_points: group.score,
        status: group.status,
        colour: this._gameData.getColorByGroupName(group.name),
      });
    });

    ranking.sort((a, b) => b.total_score - a.total_score);

    this._leaderboard.loadRanking(ranking);
    this._leaderboard.showCurrentPoints();
  }
}

export default class LeaderboardController {
  constructor(gameData, leaderboard) {
    this.gameData = gameData;
    this.leaderboard = leaderboard;
  }

  showCurrentPoints() {
    this.leaderboard.showCurrentPoints();
  }

  hideCurrentPoints() {
    this.leaderboard.hideCurrentPoints();
  }

  renderDefaultLeaderboard() {
    this.leaderboard.hideCurrentPoints();
    this.leaderboard.loadRanking(
      this.gameData.getGroups().map((group, _) => {
        return {
          name: group.name,
          total_score: 0,
          current_points: 0,
          status: "valid",
          colour: this.gameData.getColorByGroupName(group.name),
        };
      }),
    );
  }

  renderLeaderboard() {
    const ranking = [];

    this.gameData.getGroups().forEach((group, index) => {
      let total_score = 0;
      for (let level = 0; level <= this.gameData.getLevel(); level++) {
        total_score += this.gameData.getGroupByIndex(index, level).score;
      }
      ranking.push({
        name: group.name,
        total_score: total_score,
        current_points: group.score,
        status: group.status,
        colour: this.gameData.getColorByGroupName(group.name),
      });
    });

    ranking.sort((a, b) => b.total_score - a.total_score);

    this.leaderboard.loadRanking(ranking);
    this.leaderboard.showCurrentPoints();
  }
}

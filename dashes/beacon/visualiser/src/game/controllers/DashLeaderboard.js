export default class DashLeaderboard {
  constructor(gameData, leaderboard) {
    this.gameData = gameData;
    this.leaderboard = leaderboard;
  }

  compareGroups(groupB, groupA) {
    const statusOrder = { valid: 0, timeout: 1, invalid: 2 };
    if (statusOrder[groupA.status] > statusOrder[groupB.status]) {
      return -1;
    } else if (statusOrder[groupA.status] < statusOrder[groupB.status]) {
      return 1;
    } else if (groupA.score > groupB.score) {
      return -1;
    } else if (groupA.score < groupB.score) {
      return 1;
    }
    return groupB.name.localeCompare(groupA.name);
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
      this.gameData.groups.map((group, index) => {
        return {
          name: group.name,
          total_score: 0,
          current_points: 0,
          status: "valid",
          colour: this.gameData.colorByGroupName(group.name),
        };
      }),
    );
  }

  renderLeaderboard() {
    const ranking = [];

    this.gameData.groups.forEach((group, index) => {
      let total_score = 0;
      for (let level = 0; level <= this.gameData.level; level++) {
        total_score += this.gameData.groupAt(level, index).score;
      }
      ranking.push({
        name: group.name,
        total_score: total_score,
        current_points: group.score,
        status: group.status,
        colour: this.gameData.colorByGroupName(group.name),
      });
    });

    ranking.sort((a, b) => b.total_score - a.total_score);

    this.leaderboard.loadRanking(ranking);
    this.leaderboard.showCurrentPoints();
  }
}

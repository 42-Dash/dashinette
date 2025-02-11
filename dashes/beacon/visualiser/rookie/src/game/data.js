import ColorGenerator from "./misc/ColorGenerator.js";

export default class GameData {
  constructor(jsonData) {
    this._jsonData = jsonData;
    this._level = 0;
    this._colorGenerator = new ColorGenerator();
    this._colors = new Map();
    this.getGroups().forEach((group, _) => {
      this._colors.set(group.name, this._colorGenerator.next());
    });
  }

  setLevel(level) {
    this._level = level % this.#getLevelCount();
  }

  getLevel() {
    return this._level;
  }

  getGroupByIndex(groupIndex, level = this._level) {
    return this._jsonData.levels[level].groups[groupIndex];
  }

  getLevelTitle(level = this._level) {
    return this._jsonData.levels[level].lvl;
  }

  getMap(level = this._level) {
    return this._jsonData.levels[level].maps[0];
  }

  getGroupsCount(level = this._level) {
    return this._jsonData.levels[level].groups.length;
  }

  getGroups(level = this._level) {
    return this._jsonData.levels[level].groups;
  }

  getBeacons(level = this._level) {
    return this._jsonData.levels[level].beacons;
  }

  getGroupOutput(groupIndex) {
    return this.getGroupByIndex(groupIndex).output;
  }

  getGroupColor(groupIndex) {
    return this.getColorByGroupName(this.getGroupByIndex(groupIndex).name);
  }

  getColorByGroupName(groupName) {
    if (!this._colors.has(groupName)) {
      this._colors.set(groupName, this._colorGenerator.next());
    }
    return this._colors.get(groupName);
  }

  #getLevelCount() {
    return this._jsonData.levels.length;
  }

  isLastLevel() {
    return this._level === this.#getLevelCount() - 1;
  }

  isFirstLevel() {
    return this._level === 0;
  }
}

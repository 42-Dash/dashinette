import ColorGenerator from "./misc/ColorGenerator.js";

/**
 * @class GameData
 * @brief Manages game-level data, including maps, beacons, groups, and colors.
 *
 * This class is responsible for tracking the current level, retrieving game-related
 * data, and assigning colors to different groups.
 */
export default class GameData {
  static VALID_STATUS = "valid";

  constructor(jsonData) {
    this._jsonData = jsonData;
    this._level = 0;
    this._colorGenerator = new ColorGenerator();
    this._colors = new Map();
    this.#initializeGroupColors();
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

  isValidGroupStatus(groupIndex, level = this._level) {
    const textStatus = this._jsonData.levels[level].groups[groupIndex].status;
    return textStatus === GameData.VALID_STATUS;
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

  isLastLevel() {
    return this._level === this.#getLevelCount() - 1;
  }

  isFirstLevel() {
    return this._level === 0;
  }

  #getLevelCount() {
    return this._jsonData.levels.length;
  }

  #initializeGroupColors() {
    this.getGroups().forEach((group) => {
      if (!this._colors.has(group)) {
        this._colors.set(group.name, this._colorGenerator.next());
      }
    });
  }
}

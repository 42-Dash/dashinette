import ColorGenerator from "./misc/ColorGenerator.js";

export default class GameData {
  constructor(jsonData) {
    this.jsonData = jsonData;
    this._level = 0;
    this.colorGenerator = new ColorGenerator();
    this.colors = new Map();
    this.groups.forEach((group, _) => {
      this.colors.set(group.name, this.colorGenerator.next());
    });
  }

  /**
   * @param {number} level The level to set.
   */
  set level(level) {
    this._level = level % this.levelCount;
  }

  /**
   * @brief Returns the current level.
   */
  get level() {return this._level;}

  levelTitleAt(level) {
    return this.jsonData.levels[level].lvl;
  }

  mapAt(level) {
    return this.jsonData.levels[level].map;
  }

  levelTitleAt(level) {
    return this.jsonData.levels[level].lvl;
  }

  groupCountAt(level) {
    return this.jsonData.levels[level].groups.length;
  }

  groupsAt(level) {
    return this.jsonData.levels[level].groups;
  }

  groupAt(level, groupIndex) {
    return this.jsonData.levels[level].groups[groupIndex];
  }

  pathAt(level, groupIndex) {
    return this.groupAt(level, groupIndex).path;
  }

  beaconsAt(level) {
	return this.jsonData.levels[level].beacons;
  }

  /**
   * @brief Returns the current level title.
   */
  get levelTitle() {
    return this.levelTitleAt(this.level);
  }

  /**
   * @brief Returns the map of the current level.
   */
  get map() {
    return this.mapAt(this.level);
  }

  get levelCount() {
    return this.jsonData.levels.length;
  }

  get groupCount() {
    return this.groupCountAt(this.level);
  }

  get groups() {
    return this.groupsAt(this.level);
  }

  get beacons() {
	return this.beaconsAt(this.level);
  }

  /**
   * @brief Returns the group of the current level.
   */
  group(groupIndex) {
    return this.jsonData.levels[this.level].groups[groupIndex];
  }

  /**
   * @brief Returns the path of the current level.
   */
  path(groupIndex) {
    return this.group(groupIndex).path;
  }

  color(groupIndex) {
    const name = this.group(groupIndex).name;
    return this.colorByGroupName(name);
  }

  colorByGroupName(groupName) {
    if (!this.colors.has(groupName))
      this.colors.set(groupName, this.colorGenerator.next());
    return this.colors.get(groupName);
  }

  isLastLevel() {
    return this.level == this.levelCount - 1;
  }

  isFirstLevel() {
    return this.level == 0;
  } 
}

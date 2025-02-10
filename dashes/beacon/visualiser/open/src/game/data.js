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

  set level(level) {
    this._level = level % this.levelCount;
  }

  get level() {
    return this._level;
  }

  levelTitleAt(level) {
    return this.jsonData.levels[level].lvl;
  }

  // There is only one map in tag maps
  mapAt(level) {
    return this.jsonData.levels[level].maps[0];
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

  beaconsAt(level) {
    return this.jsonData.levels[level].beacons;
  }

  get levelTitle() {
    return this.levelTitleAt(this.level);
  }

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

  group(groupIndex) {
    return this.jsonData.levels[this.level].groups[groupIndex];
  }

  output(groupIndex) {
    return this.group(groupIndex).output;
  }

  color(groupIndex) {
    return this.colorByGroupName(this.group(groupIndex).name);
  }

  colorByGroupName(groupName) {
    if (!this.colors.has(groupName)) {
      this.colors.set(groupName, this.colorGenerator.next());
    }
    return this.colors.get(groupName);
  }

  isLastLevel() {
    return this.level === this.levelCount - 1;
  }

  isFirstLevel() {
    return this.level === 0;
  }
}

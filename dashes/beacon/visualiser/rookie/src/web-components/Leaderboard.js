/**
 * A Web Component representing a dynamic leaderboard.
 * @extends {HTMLElement}
 */
export default class Leaderboard extends HTMLElement {
  constructor() {
    super();
    this._animationInfos = [];
    this._shadow = null;
    this._resizeObserver = null;
    this._mutationObserver = null;
  }

  connectedCallback() {
    this._shadow = this.attachShadow({ mode: "open" });

    const cssSheet = new CSSStyleSheet();
    cssSheet.replaceSync(`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1em;
        transition: 0.5s;
      }

      :host * {
        font-family: var(--font-family);
        font-size: var(--font-size);
      }

      .ranking-entry p, .ranking-header p {
        margin: 0;
      }

      .cost, .total_score, .current_points, .name {
        color: rgb(9, 3, 31);
      }

      .name {
        width: 50%;
      }

      .current_points {
        opacity: var(--current-points-opacity, 0);
        transition: opacity 0.2s;
      }

      .ranking-entry, .ranking-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5em;
        background-color: #31006e;
        border-radius: 1em;
      }

      .ranking-header { background-color: transparent; }
      .ranking-header > * { color: white; }
    `);

    this._shadow.adoptedStyleSheets = [cssSheet];

    const fragment = document.createDocumentFragment();
    const template = document.getElementById("ranking-header");
    if (template) {
      fragment.appendChild(template.cloneNode(true).content);
    }
    this._shadow.appendChild(fragment);

    this._resizeObserver = new ResizeObserver(() => this.#resize());
    this._mutationObserver = new MutationObserver(() => this.#resize());

    this._resizeObserver.observe(this);
    this._mutationObserver.observe(this, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  showCurrentPoints() {
    this.style.setProperty("--current-points-opacity", 1);
  }

  hideCurrentPoints() {
    this.style.setProperty("--current-points-opacity", 0);
  }

  loadRanking(rankedGroups) {
    const rankingTemplate = document.getElementById("ranking-group");

    rankedGroups.forEach((group) => {
      const elementId = `group_name_${group.name}`;
      let rankingEntry = this._shadow.getElementById(elementId);

      if (rankingEntry == null) {
        rankingEntry = this.#createRankingEntry(rankingTemplate);
        this.#updateRankingEntry(rankingEntry, group);
        this.#storeInitialPosition(rankingEntry);
      } else {
        this.#animateRankingChange(rankingEntry, group);
      }
    });

    this.#resize();
  }

  #createRankingEntry(template) {
    const groupElement = document.createDocumentFragment();
    groupElement.appendChild(template.cloneNode(true).content);
    return groupElement.querySelector(".ranking-entry");
  }

  #storeInitialPosition(rankingEntry) {
    requestAnimationFrame(() =>
      this._animationInfos.push({
        rankingEntry,
        top: rankingEntry.getBoundingClientRect().top,
      }),
    );
  }

  #updateRankingEntry(rankingEntry, group) {
    this.#loadGroupInfo(group, rankingEntry);
    this._shadow.appendChild(rankingEntry);
  }

  #animateRankingChange(rankingEntry, group) {
    const animationInfo = this._animationInfos.find(
      (info) => info.rankingEntry === rankingEntry,
    );
    if (!animationInfo) return;

    this.#updateRankingEntry(rankingEntry, group);

    requestAnimationFrame(() => {
      const newTop = rankingEntry.getBoundingClientRect().top;
      const deltaY = animationInfo.top - newTop;

      rankingEntry.style.transform = `translateY(${deltaY}px)`;
      rankingEntry.style.transition = `transform 0s`;

      requestAnimationFrame(() => {
        rankingEntry.style.transform = "";
        rankingEntry.style.transition = "0.5s";
        animationInfo.top = newTop;
      });
    });
  }

  #loadGroupInfo(group, rankingEntry) {
    const brightness = group.status !== "valid" ? 0.5 : 1;
    const color = {
      r: group.colour.r * brightness,
      g: group.colour.g * brightness,
      b: group.colour.b * brightness,
    };

    rankingEntry.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    rankingEntry.id = `group_name_${group.name}`;

    const currentPoints = rankingEntry.querySelector(".current_points");
    const totalScore = rankingEntry.querySelector(".total_score");
    const name = rankingEntry.querySelector(".name");

    currentPoints.textContent = `+${group.current_points}`;
    totalScore.textContent = `${group.total_score}`;
    name.textContent = group.name;
  }

  #resize() {
    const elementHeight = this.getBoundingClientRect().height;
    const childCount = this._shadow.childElementCount;
    const fontSize = Math.max((elementHeight / childCount) * 0.25, 0);

    this.style.setProperty("--font-size", `${fontSize}px`);
  }
}

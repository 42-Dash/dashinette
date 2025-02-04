export default class DashLeaderboard extends HTMLElement {
  constructor() {
    super();
    this.animationInfos = [];
    this.shadow = null;
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "closed" });
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
        margin: 0; /* Remove default margin to eliminate additional space */
      }

      .name {
        color: rgb(9, 3, 31);
        width: 50%;
      }
      .cost { color: rgb(9, 3, 31); }
      .total_score { color: rgb(9, 3, 31); }
      .current_points {
        color: rgb(9, 3, 31);
        opacity: var(--current-points-opacity, 0);
        transition: opacity 0.2s;
      }

      .ranking-entry, .ranking-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5em;
        background-color: #31006e; /* Background box color with transparency */
        border-radius: 1em; /* Rounded corners for the box */
      }

      .ranking-header { background-color: transparent; }

      .ranking-header > * { color: white; }
    `);
    this.shadow.adoptedStyleSheets = [cssSheet];
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      document.getElementById("ranking-header").cloneNode(true).content,
    );
    this.shadow.appendChild(fragment);

    // This resizes the canvases within when this custom HTML element is resized.
    this.resizeObserver = new ResizeObserver((_) => this.#resize());
    // This redraws the canvases within when new canvases are added.
    this.mutationObserver = new MutationObserver((_) => this.#resize());
    this.resizeObserver.observe(this);
    this.mutationObserver.observe(this, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    this.mutationObserver.disconnect();
  }

  loadRanking(rankedGroups) {
    const rankingTemplate = document.getElementById("ranking-group");

    for (const group of rankedGroups) {
      const existingElement = this.shadow.getElementById(
        "group_name_" + group.name,
      );
      if (existingElement == null) {
        const groupElement = document.createDocumentFragment();
        groupElement.appendChild(rankingTemplate.cloneNode(true).content);
        const rankingEntry = groupElement.querySelector(".ranking-entry");
        this.#loadGroupInfo(group, rankingEntry);
        this.shadow.appendChild(rankingEntry);
        requestAnimationFrame(() => {
          this.animationInfos.push({
            rankingEntry,
            top: rankingEntry.getBoundingClientRect().top,
          });
        });
      } else {
        const rankingEntry = existingElement;
        const animationInfo = this.animationInfos.find(
          (info) => info.rankingEntry === rankingEntry,
        );
        this.#loadGroupInfo(group, rankingEntry);
        this.shadow.appendChild(rankingEntry);
        requestAnimationFrame(() => {
          //   //Get the new position
          const newTop = rankingEntry.getBoundingClientRect().top;
          //   //Get the previously saved position
          const oldTop = animationInfo.top;
          //   //Compute delta between old position and new
          const deltaY = oldTop - newTop;
          //   //Translate the element to its old location
          rankingEntry.style.transform = `translateY(${deltaY}px)`;
          //   //Disable transition animation for this translation
          rankingEntry.style.transition = `transform 0s`;
          //   //Save the new position
          animationInfo.top = newTop;
          requestAnimationFrame(() => {
            rankingEntry.style.transform = "";
            rankingEntry.style.transition = "0.5s";
          });
        });
      }
    }
    this.#resize();
  }

  showCurrentPoints() {
    this.style.setProperty("--current-points-opacity", 1);
  }

  hideCurrentPoints() {
    this.style.setProperty("--current-points-opacity", 0);
  }

  #loadGroupInfo(group, rankingEntry) {
    const isValid = group.status !== "valid" ? 0.5 : 1;
    rankingEntry.style.backgroundColor = `rgb(${group.colour.r * isValid}, ${
      group.colour.g * isValid
    }, ${group.colour.b * isValid})`;
    rankingEntry.id = "group_name_" + group.name;
    rankingEntry.querySelector(".name").textContent = group.name;
    rankingEntry.querySelector(".total_score").textContent =
      `${group.total_score}`;
    rankingEntry.querySelector(".current_points").textContent =
      `+${group.current_points}`;
  }

  #resize() {
    const fontSize =
      this.shadow.childElementCount !== 0
        ? (this.getBoundingClientRect().height /
            this.shadow.childElementCount) *
          0.25
        : 0;
    this.style.setProperty("--font-size", `${fontSize}px`);
  }
}

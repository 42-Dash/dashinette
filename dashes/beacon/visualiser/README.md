# Dash Visualizer

## Overview
The **Dash Visualizer** is a tool designed to display the results of the Dash-Beacon programming competition. It provides a graphical representation of how teams performed by rendering their beacon placements on a map. The visualizer supports two leagues:

- **Rookie League**: Participants must place beacons on a single plastic board to maximize coverage of nodes.
- **Open League**: Participants select the best configuration of four maps to achieve optimal node coverage.

## Installation and Usage

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### Important Note
- The results file **`result.json`** must be placed in the **root directory** for the visualizer to function correctly.

### Installation using npm
Run the following command to install dependencies:

```sh
npm install
```

### Running the Visualizer
Start the visualizer using:

```sh
npm start
```

This will launch the visualizer on **localhost:8080**.

### Installation using Docker
Alternatively, you can run the visualizer using Docker:

```sh
docker build -t dash-visualizer .
docker run -p 8080:8080 dash-visualizer
```

This method ensures a consistent environment for running the visualizer.

## JSON File Requirements
- The results file must be placed in the **root directory**.
- The JSON file must include a **league property** indicating either `Rookie League` or `Open League`.
- The file should follow a predefined structure, including beacon placements and their sizes.
- Example JSON file structures can be found in the `test-data/` directory.

## Visualizer Interface
- The **left side** of the interface displays the competition map.
- The **right side** shows the leaderboard and participant details.
- White dots represent **nodes** that need to be covered.
- Squares represent **beacon coverage areas**.
- Beacons positions **cannot overlap**.

### Controls
- **Next** button: Moves to the next level or result.
- **Start** button: Resets and starts from the first result.

## Dependencies
- **p5.js**: Used for rendering graphics.
- **Prettier**: Enforces consistent code formatting.

## Notes
- Positions update automatically as new results are loaded.
- The project enforces formatting using **Prettier**.

## Project Structure
```
/ (Root Directory)
│── result.json (Required results file)
│── server.js
│── README.md
│── package.json
│── index.html
│── Dockerfile
│── /test-data (Sample data for testing, including example result.json files)
│── /src (Source code)
```


# Dash Competition Framework

Dash is a competition framework designed to run and visualize programming-based challenges. It supports multiple competitions, with current implementations for **Beacon** and **Marvin**.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Competition](#running-the-competition)
- [Results & Logs](#results--logs)
- [Visualization](#visualization)
- [Scripts](#scripts)
- [License](#license)

## Overview
Dash enables participants to compete in programming challenges by providing executable solutions. The framework supports:
- Multiple competitions with modular grading
- Configuration-driven execution
- Automated logging and result storage
- Visualization tools for performance analysis

## Prerequisites
Ensure you have the following installed before proceeding:
- **Taskfile** - Required for running compilation tasks (*optional*)
- **Docker** - Used for containerized execution
- **Git** - Necessary for managing participant repositories
- **GitHub Organization** – A dedicated organization where all repositories will be created
- **template-{competition}** Repository – A template repository inside *the dedicated organization* used for initializing participant repositories

### API Token
For authentication and repository management, a valid **GitHub Personal Access Token (PAT)** is required. The token must have the following scopes:
- `admin:org`
- `repo`
- `delete_repo`

## Installation
Clone the repository:
```sh
# Clone the repository
git clone https://github.com/42-Dash/dashinette.git
cd dashinette
```

## Configuration
All configuration files are stored in the `config/` directory:
- **`maps.json`** – Defines competition maps
- **`participants.json`** – Lists participating teams
- **`.env`** – Stores environment variables

### `.env` Example
Create a `.env` file in `config/` with the following format:
```sh
GITHUB_ACCESS=your_github_access_token
GITHUB_ORGANISATION=your_github_organisation
```

## Running the Competition
Dash competitions are compiled and executed using Taskfile:
```sh
# Run the contest using Taskfile
task {competition to start}
# Or run the contest directly
go run cmd/{competition}/{competition}/main.go
```
This launches a CLI menu allowing you to:
- Initialize repositories
- Analyze submissions
- Run grading and visualization
- Manage collaborators

## Results & Logs
Competition results and logs are stored in the root directory:
- `app.log` – Stores execution logs
- `open_results.json` – Results for Open League
- `rookie_results.json` – Results for Rookie League

## Visualization
Each competition has a dedicated visualizer located in:
```sh
dashes/{competition}/visualiser/
```
Detailed documentation for visualizers can be found in the respective `README.md` files.

## Scripts
Additional scripts are available in `scripts/general/`:
- **`delete_repos.sh`** – Deletes all competition repositories
- **`reshuffle_config.sh`** – Randomizes participant order for fairness

## License
The project license will be added soon. See `LICENSE` for more details.

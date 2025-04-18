# Dash - Marvin
## Contest Challenge

**Objective:** Develop a program that finds the most cost-effective path through a map. Beginning at `M` and ending at `G`, your program must traverse tiles labeled `1` - `9`, paying the corresponding cost with every step. Aim to minimise the total cost of your journey.

### General Instructions
- The program must compile using the command `make` in the root directory.
- You are not allowed to use any compile flags (yes this includes performance flags!)
- The compiled executable should be named `marvin` and placed in the root directory during the compilation via the Makefile.
- `C` is mandatory (C++, Go \<version 1.22.5\>, Rust for `Open League`)
- No norm is required
- Usage of external libraries is not allowed. Except for all libraries shipped with the compiler itself (example: #include <stdio.h>).
- Feel free to use your libft or any other code you've written previously.
- Memory leaks are not a concern.
- Be prepared to explain your logic during presentation to ensure originality and authenticity.
- No multithreading

### Traces
During the Dash, you'll receive traces at the 6th, and 8th hours. These feedback moments are designed to ensure your output is correct. They will check if you:
- Compile your executable the right way.
- Reach the goal.
- Return any unnecessary characters.
- Stay within the maps boundaries.

The traces will be pushed to your repository. (inside the branch `traces` so don't store your code inside there :))

### Input Instructions
- Maps contain lines of uniform length.
- Valid characters include:
  - 'M': starting point (only one per map).
  - 'G': goal (only one per map).
  - '1' - '9': cost tiles.
- The map given will always be valid
- The map file is passed as a command-line argument: `./marvin planet.txt`.
- Always expect just one command-line argument (argc == 2).
- The file will always be present and will have read rights.
### Output Criteria

- Display the sequence of moves towards the goal:
  - `U`: Up
  - `D`: Down
  - `R`: Right
  - `L`: Left
- The output sequence should conclude with a newline (`\n`).

**Example:**
planet.txt
```
88888
81118
81818
8M8G8
88888
```

Execution:
```
./marvin planet.txt | cat -e
UURRDD$
```

Multiple solutions can be submitted, but only the latest one ending with a newline will be considered.
```
./marvin planet.txt | cat -e
RR$
UURRDD$
LUU
```
Here the second line `UURRDD$` will be considered as the solution
### Assessment

After the end of the coding time, your submitted programs will be compiled and tested against multiple unique maps (with potentially different timeouts).
For each map, your program has a fixed amount of seconds to deliver its optimal solution (we will timeout your program afterwards so don't worry about ending your program). Points will be awarded based on the path with the lowest cost amongst the participants, similar to how racers collect points in Mario Kart. After all the challenges are completed, teams will be ranked based on their total points, with the team having the highest score being declared the winner.

## Open League Additions
You can also use `C++`, `Go` or `Rust` in the Open League
### Enhanced Input
#### Terrain Modifiers

Along with the standard map, terrain identifiers now enhance gameplay:

```
MMW8A2
A3E6GG
```
Here:
- `W`: Water/Ocean
- `A`: Air/Clouds
- `E`: Earth
- `MM`: Marvin (Start position)
- `GG`: Goal
#### Character Creation
Craft a character resembling the Fallout series, distributing 10 skill points among:
- Water
- Air
- Earth

The maximum allocation for any element is 5 points. Your character's element affinity **affects tile costs**:
- 0 points => 8
- 1 point => 6
- 2 points => 5
- 3 points => 4
- 4 points => 3
- 5 points => 2

For instance, with 2 Water points, moving onto a `W4` tile costs 5 * 4 = 20.
### Output Additions

Begin with your character's configuration, followed by the movement sequence.

**Example:**
```
./marvin planet.txt | cat -e
055DRR$
```

Here, `055` displays the allocated points for Water, Air, and Earth, in this order, respectively.

```
With 055 the total cost would be 3 * 2 (A3) + 6 * 2 (E6) = 18
With 505 it would be 3 * 8 (A3) + 6 * 2 (E6) = 36
```

Keep in mind that your character can significantly affect the cost of a given path, so choose wisely!

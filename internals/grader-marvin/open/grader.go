package open

import (
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
	"strings"
)

// returns the multiplier for the given points.
func getMultiplier(points byte) int {
	switch points {
	case '0':
		return 8
	case '1':
		return 6
	case '2':
		return 5
	case '3':
		return 4
	case '4':
		return 3
	default:
		return 2
	}
}

// returns character points
func characterPoints(character [3]byte) (int, int, int) {
	var water, air, earth int

	water = getMultiplier(character[0])
	air = getMultiplier(character[1])
	earth = getMultiplier(character[2])
	return water, air, earth
}

// trims the path to remove the character points.
func splitPath(path string) (string, string) {
	if len(path) < 4 {
		return path, ""
	}
	return path[:3], path[3:]
}

// validates the pattern of the path
func isValidPath(path string) bool {
	var character, steps string
	var character_sum int

	if len(path) < 4 {
		return false
	}

	character, steps = splitPath(path)

	for _, chr := range character {
		if !strings.ContainsRune("012345", chr) {
			return false
		}
		character_sum += int(chr - '0')
	}

	if character_sum != 10 {
		return false
	}

	for _, chr := range steps {
		if !strings.ContainsRune("UDLR", chr) {
			return false
		}
	}
	return true
}

// applies the list of given instructions and returns the score.
func getScoreOpenLeague(path string, input []string) (int, error) {
	if !isValidPath(path) {
		return 0, fmt.Errorf("error: invalid path")
	}
	var x, y, score int
	var w, a, e int = characterPoints([3]byte{path[0], path[1], path[2]})

	x, y = common.PlayersPosition(input)
	for _, chr := range path[3:] {
		if chr == 'U' {
			x -= 1
		} else if chr == 'D' {
			x += 1
		} else if chr == 'L' {
			y -= 2
		} else if chr == 'R' {
			y += 2
		} else {
			return 0, fmt.Errorf("error: invalid path")
		}

		if x < 0 || x >= len(input) || y < 0 || y >= len(input[0]) {
			return 0, fmt.Errorf("error: out of bounds")
		}

		if strings.ContainsRune("0123456789", rune(input[x][y+1])) {
			switch input[x][y] {
			case 'W':
				score += int(w * int(input[x][y+1]-'0'))
			case 'A':
				score += int(a * int(input[x][y+1]-'0'))
			case 'E':
				score += int(e * int(input[x][y+1]-'0'))
			}
		}
	}
	if input[x][y] != 'G' {
		return 0, fmt.Errorf("error: marvin didnt reach the goal")
	}
	return score, nil
}

// grades the assignment in the given file.
//
// Parameters:
//   - filename: The name of the file to grade.
//   - timeout: The timeout for the grading process.
//
// Returns:
//   - int: The grade of the assignment.
//   - error: An error object if an error occurred, otherwise nil.
func GradeOpenLeagueAssignment(filename string, inputfile string, timeout int) (string, int, error) {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		return "", 0, fmt.Errorf("error: \"marvin\" file not found")
	}

	output, err := common.ExecuteWithTimeout(filename, []string{inputfile}, timeout)
	if err != nil {
		return "", 0, err
	}

	path, err := common.ExtractLastAnswer(output, common.VALID_RUNES_OPEN_LEAGUE)
	if err != nil {
		return path, 0, err
	}
	_, trimmedPath := splitPath(path)

	input, _ := os.ReadFile(inputfile)
	inputStr := strings.Split(string(input), "\n")
	inputStr = inputStr[:len(inputStr)-1]
	score, err := getScoreOpenLeague(path, inputStr)

	if err != nil {
		return trimmedPath, 0, err
	}
	return trimmedPath, score, nil
}

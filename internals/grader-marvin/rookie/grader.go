package rookie

import (
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
	"strings"
)

// applies the list of given instructions and returns the score.
func getScoreRookieLeague(path string, input []string) (int, error) {
	var x, y, score int

	x, y = common.PlayersPosition(input)
	for _, chr := range path {
		if chr == 'U' {
			x -= 1
		} else if chr == 'D' {
			x += 1
		} else if chr == 'L' {
			y -= 1
		} else if chr == 'R' {
			y += 1
		} else {
			return 0, fmt.Errorf("error: invalid path")
		}

		if x < 0 || x >= len(input) || y < 0 || y >= len(input[0]) {
			return 0, fmt.Errorf("error: out of bounds")
		}

		if strings.ContainsRune("123456789", rune(input[x][y])) {
			score += int(input[x][y] - '0')
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
func GradeRookieLeagueAssignment(filename, inputfile string, timeout int) (string, int, error) {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		return "", 0, fmt.Errorf("error: \"marvin\" file not found")
	}

	output, err := common.ExecuteWithTimeout(filename, inputfile, timeout)
	if err != nil {
		return "", 0, err
	}

	path, err := common.ExtractLastAnswer(output, common.VALID_RUNES_ROOKIE_LEAGUE)
	if err != nil {
		return path, 0, err
	}

	input, _ := os.ReadFile(inputfile)
	inputStr := strings.Split(string(input), "\n")
	inputStr = inputStr[:len(inputStr)-1]
	score, err := getScoreRookieLeague(path, inputStr)

	if err != nil {
		return path, 0, err
	}
	return path, score, nil
}

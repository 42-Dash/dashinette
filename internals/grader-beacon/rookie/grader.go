package rookie

import (
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const VALID_RUNES_BEACONS = "0123456789|,\n"

type Beacon struct {
	Row  int
	Col  int
	Size int
}

func countScore(field [][]rune, beacon Beacon) int {
	var score int = 0

	for i := -beacon.Size; i <= beacon.Size; i++ {
		for j := -beacon.Size; j <= beacon.Size; j++ {
			if beacon.Row+i < 0 || beacon.Row+i >= len(field) ||
				beacon.Col+j < 0 || beacon.Col+j >= len(field[0]) {
				continue
			}

			if field[beacon.Row+i][beacon.Col+j] == '*' {
				score++
				field[beacon.Row+i][beacon.Col+j] = '.'
			}
		}
	}

	return score
}

func getField(inputfile string) ([][]rune, error) {
	content, err := os.ReadFile(inputfile)
	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(content), "\n")
	var field [][]rune = make([][]rune, len(lines))
	for i, line := range lines {
		field[i] = []rune(line)
	}

	return field, nil
}

func getBeacons(placements []string, beacons []string) []Beacon {
	var result []Beacon = make([]Beacon, len(placements))

	for i, placement := range placements {
		var row, col int
		fmt.Sscanf(placement, "%d,%d", &row, &col)
		beacon, err := strconv.Atoi(string(beacons[i]))
		if err != nil {
			panic(err)
		}

		result[i] = Beacon{row, col, beacon}
	}

	return result
}

func getScoreRookieLeague(output string, inputs []string) (int, error) {
	field, err := getField(inputs[1])
	if err != nil {
		return 0, err
	}

	beacons := getBeacons(strings.Split(output, "|"), strings.Split(inputs[0], " "))
	var score int = 0

	for i, beacon := range beacons {
		if beacon.Row < 0 || beacon.Row >= len(field) ||
			beacon.Col < 0 || beacon.Col >= len(field[0]) {
			return 0, fmt.Errorf("error: beacon #%d is out of bounds", i+1)
		}

		if field[beacon.Row][beacon.Col] == '*' {
			return 0, fmt.Errorf("error: beacon #%d is placed on a node", i+1)
		}

		if field[beacon.Row][beacon.Col] == '#' {
			return 0, fmt.Errorf("error: beacon #%d is placed on a beacon", i+1)
		}

		score += countScore(field, beacon)
		field[beacon.Row][beacon.Col] = '#'
	}

	return score, nil
}

func GradeRookieLeagueAssignment(filename string, inputs []string, timeout int) (string, int, error) {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		return "", 0, fmt.Errorf("error: \"beacon\" file not found")
	}

	output, err := common.ExecuteWithTimeout(filename, inputs, timeout)
	if err != nil {
		return "", 0, err
	}

	output, err = common.ExtractLastAnswer(output, VALID_RUNES_BEACONS)
	if err != nil {
		return output, 0, err
	}

	score, err := getScoreRookieLeague(output, inputs)
	return output, score, err
}

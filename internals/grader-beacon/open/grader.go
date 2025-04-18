package open

import (
	"dashinette/internals/grader-beacon/rookie"
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const VALID_RUNES_BEACONS = "0123456789|,\n"

func countScore(field [][]rune, beacon rookie.Beacon) int {
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

func readFiles(inputfiles []string) ([][]string, error) {
	var result [][]string = make([][]string, len(inputfiles))

	for i, inputfile := range inputfiles {
		content, err := os.ReadFile(inputfile)
		if err != nil {
			return nil, err
		}

		result[i] = strings.Split(string(content), "\n")
	}

	return result, nil
}

func mergeField(contents [][]string, order []int) [][]rune {
	size := len(contents[0]) - 1
	newField := make([]string, size*2)

	for i := range size {
		newField[i] = contents[order[0]][i] + contents[order[1]][i]
		newField[i+size] = contents[order[2]][i] + contents[order[3]][i]
	}

	var result [][]rune = make([][]rune, size*2)
	for i, line := range newField {
		result[i] = []rune(line)
	}

	return result
}

func getField(order string, inputfile []string) ([][]rune, error) {
	contents, err := readFiles(inputfile)
	if err != nil {
		return nil, err
	}

	if len(order) != 4 {
		return nil, fmt.Errorf("error: invalid order length")
	}

	for i := range 4 {
		if order[i] < '1' || order[i] > '4' {
			return nil, fmt.Errorf("error: invalid order %c", order[i])
		}
	}

	for i := range 4 {
		for j := range 4 {
			if i != j && order[i] == order[j] {
				return nil, fmt.Errorf("error: order contains duplicates")
			}
		}
	}

	field := mergeField(contents, []int{
		int(order[0] - '1'),
		int(order[1] - '1'),
		int(order[2] - '1'),
		int(order[3] - '1'),
	})

	return field, nil
}

func getBeacons(field [][]rune, placements []string, beacons []string) ([]rookie.Beacon, error) {
	if len(placements) != len(beacons) {
		return nil, fmt.Errorf("error: number of beacons and placements do not match")
	}

	var result []rookie.Beacon = make([]rookie.Beacon, len(placements))

	for i, placement := range placements {
		if len(placement) < 3 || !strings.Contains(placement, ",") ||
			strings.Count(placement, ",") != 1 {
			return nil, fmt.Errorf("error: invalid placement format for beacon #%d", i+1)
		}

		var row, col int
		fmt.Sscanf(placement, "%d,%d", &row, &col)

		beacon, err := strconv.Atoi(string(beacons[i]))
		if err != nil {
			panic(err) // lol protection
		}

		if row < 0 || col < 0 || row >= len(field) || col >= len(field[0]) {
			return nil, fmt.Errorf("error: beacon #%d is out of bounds", i+1)
		}

		if placement[0] == ',' || placement[len(placement)-1] == ',' {
			return nil, fmt.Errorf("error: beacon #%d has invalid format", i+1)
		}

		result[i] = rookie.Beacon{
			Row:  row,
			Col:  col,
			Size: beacon + int(field[row][col]) - '0',
		}
	}

	return result, nil
}

func getScoreOpenLeague(output string, inputs []string) (int, error) {
	if len(output) < 8 {
		return 0, fmt.Errorf("error: invalid output")
	}

	field, err := getField(strings.Split(output, "|")[0], inputs[1:])
	if err != nil {
		return 0, err
	}

	beacons, err := getBeacons(field, strings.Split(output, "|")[1:], strings.Split(inputs[0], " "))
	if err != nil {
		return 0, err
	}
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

func GradeOpenLeagueAssignment(filename string, inputs []string, timeout int) (string, int, error) {
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

	score, err := getScoreOpenLeague(output, inputs)
	return output, score, err
}

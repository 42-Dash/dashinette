package rookie

import (
	"dashinette/internals/grader-beacon/open"
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
)

func getScoreRookieLeague(output string, inputs []string) (int, error) {
	fmt.Println("getScoreRookieLeague")
	fmt.Println("output: ", output)
	fmt.Println("inputs: ", inputs)
	return 42, nil
}

func GradeRookieLeagueAssignment(filename string, inputs []string, timeout int) (string, int, error) {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		return "", 0, fmt.Errorf("error: \"beacon\" file not found")
	}

	output, err := common.ExecuteWithTimeout(filename, inputs, timeout)
	if err != nil {
		return "", 0, err
	}

	output, err = common.ExtractLastAnswer(output, open.VALID_RUNES_BEACONS)
	if err != nil {
		return output, 0, err
	}

	score, err := getScoreRookieLeague(output, inputs)
	return output, score, err
}

package open

import (
	"dashinette/internals/grader-marvin/common"
	"fmt"
	"os"
)

const VALID_RUNES_BEACONS = "0123456789|,\n"

func getScoreOpenLeague(output string, inputs []string) (int, error) {
	fmt.Println("getScoreOpenLeague")
	fmt.Println("output: ", output)
	fmt.Println("inputs: ", inputs)
	return 42, nil
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

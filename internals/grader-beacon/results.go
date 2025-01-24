package grader

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type Group struct {
	Name   string `json:"name"`
	Status string `json:"status"`
	Score  int    `json:"score"`
	Output string `json:"output"`
}

type Level struct {
	Level   string     `json:"lvl"`
	Beacons string     `json:"beacons"`
	Maps    [][]string `json:"maps"`
	Groups  []Group    `json:"groups"`
}

type Results struct {
	League string  `json:"league"`
	Levels []Level `json:"levels"`
}

func getFirstValue(traces map[string]Traces) (res Traces) {
	for _, trace := range traces { //wft there is no other way to get the keys
		res = trace
		break
	}
	return res
}

func extractLevel(line string) int {
	match := regexp.MustCompile(`level_(\d+)`).FindStringSubmatch(line)[1]
	if match == "" {
		panic("No level found") // should never happen
	}
	res, err := strconv.Atoi(match)
	if err != nil {
		panic(err) // should never happen
	}
	return res
}

func readFiles(filenames []string) [][]string {
	var res [][]string = make([][]string, 0, len(filenames))
	for _, filename := range filenames {
		content, err := os.ReadFile(filename)
		if err != nil {
			panic(err)
		}
		res = append(res, strings.Split(string(content), "\n"))
	}

	return res
}

func initResults(league string, traces map[string]Traces) Results {
	results := Results{
		League: league,
		Levels: make([]Level, 0, len(getFirstValue(traces).Grades)),
	}

	for _, level := range getFirstValue(traces).Grades {
		results.Levels = append(results.Levels, Level{
			Level:   fmt.Sprintf("Level %d", extractLevel(level.StageMaps[0])),
			Beacons: level.Beacons,
			Maps:    readFiles(level.StageMaps),
			Groups:  make([]Group, 0, len(traces)),
		})
	}

	return results
}

func StoreResults(traces map[string]Traces, league, filename string) error {
	results := initResults(league, traces)

	for teamName, teamResult := range traces {
		for i, level := range teamResult.Grades {
			results.Levels[i].Groups = append(results.Levels[i].Groups, Group{
				Name:   teamName,
				Status: level.Status,
				Score:  level.Cost,
				Output: level.Output,
			})
		}
	}

	content, err := json.MarshalIndent(results, "", "\t")
	if err != nil {
		return err
	}

	return os.WriteFile(filename, content, 0644)
}

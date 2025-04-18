package main

import (
	"dashinette/internals/grader-beacon"
	"encoding/json"
	"log"
	"os"
)

var (
	resultFile string
	traces     []grader.Results
)

func fileExists(filename string) bool {
	if _, err := os.Stat(filename); err == nil {
		return true
	}

	return false
}

func fileRead(filename string) grader.Results {
	var content grader.Results

	if !fileExists(filename) {
		log.Fatalf("error: file %s does not exist", filename)
	}

	data, err := os.ReadFile(filename)
	if err != nil {
		log.Fatalf("Error reading file: %v", err)
	}

	err = json.Unmarshal(data, &content)
	if err != nil {
		log.Fatalf("Error parsing file: %v", err)
	}

	return content
}

func findTeamIndex(name string, groups []grader.Group) int {
	for index, team := range groups {
		if team.Name == name {
			return index
		}
	}
	return -1
}

func combineResults() grader.Results {
	results := traces[0]

	for _, team := range traces[1:] {
		for level, trace := range team.Levels {
			for _, group := range trace.Groups {
				teamIndex := findTeamIndex(group.Name, results.Levels[level].Groups)
				if teamIndex == -1 {
					log.Fatal("error: team not found")
				}
				if results.Levels[level].Groups[teamIndex].Score < group.Score {
					results.Levels[level].Groups[teamIndex].Status = group.Status
					results.Levels[level].Groups[teamIndex].Score = group.Score
					results.Levels[level].Groups[teamIndex].Output = group.Output
				}
			}
		}
	}
	return results
}

func verifyLeague() {
	league := traces[0].League
	for _, result := range traces {
		if result.League != league {
			log.Fatalf("error: leagues do not match")
		}
	}
}

func serializeResults(results grader.Results) {
	original, err := json.MarshalIndent(results, "", "\t")
	if err != nil {
		log.Fatalf("Error serializing results: %v", err)
	}

	if err = os.WriteFile(resultFile, original, 0644); err != nil {
		log.Fatalf("Error writing file: %v", err)
	}
}

func sortGroupsNameWise(results grader.Results) {
	for _, level := range results.Levels {
		N := len(level.Groups)
		for i := range N-1 {
			for j := i + 1; j < N; j++ {
				if level.Groups[i].Name > level.Groups[j].Name {
					level.Groups[i], level.Groups[j] = level.Groups[j], level.Groups[i]
				}
			}
		}
	}
}

func main() {
	verifyLeague()
	results := combineResults()
	sortGroupsNameWise(results)
	serializeResults(results)
}

func init() {
	if len(os.Args) < 4 {
		log.Fatal("usage: ./main <output_file> <result_file_1> <result_file_2> ...")
	}

	resultFile = os.Args[1]

	traces = make([]grader.Results, 0, len(os.Args)-2)
	for i := 2; i < len(os.Args); i++ {
		traces = append(traces, fileRead(os.Args[i]))
	}
}

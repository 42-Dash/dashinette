package main

import (
	"bytes"
	"encoding/json"
	"log"
	"os"
)

// structure of the required results.json file
type Group struct {
	Name   string `json:"name"`
	Status string `json:"status"`
	Score  int    `json:"score"`
	Path   string `json:"path"`
}

type Level struct {
	Name   string   `json:"lvl"`
	Map    []string `json:"map"`
	Groups []Group  `json:"groups"`
}

type Results struct {
	League string  `json:"league"`
	Levels []Level `json:"levels"`
}

func fileExists(filename string) bool {
	if _, err := os.Stat(filename); err == nil {
		return true
	}

	return false
}

func validateArguments() {
	if len(os.Args) < 4 {
		log.Fatal("usage: ./main <output_file> <input_file1> <input_file2> ...")
	}

	if fileExists(os.Args[1]) {
		log.Fatalf("error: file %s already exists", os.Args[1])
	}

	for i := 2; i < len(os.Args); i++ {
		if !fileExists(os.Args[i]) {
			log.Fatalf("error: file %s does not exist", os.Args[i])
		}
	}
}

func parseFile(filename string) Results {
	var content Results

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

func readResultFiles(files []string) []Results {
	var results []Results

	for _, file := range files {
		results = append(results, parseFile(file))
	}

	return results
}

func convertToResult(
	levels map[string]map[string]Group,
	maps map[string][]string,
) Results {
	var result Results

	for levelName, groups := range levels {
		var level Level
		level.Name = levelName
		level.Map = maps[levelName]
		for _, group := range groups {
			level.Groups = append(level.Groups, group)
		}
		result.Levels = append(result.Levels, level)
	}

	return result
}

func combineResults(results []Results) Results {
	var combined map[string]map[string]Group = make(map[string]map[string]Group)
	var maps map[string][]string = make(map[string][]string)

	// for result in results
	for _, result := range results {
		// for level in result
		for _, level := range result.Levels {
			// if level is already in combined
			if _, ok := combined[level.Name]; ok {
				// for group in level
				for _, group := range level.Groups {
					// stores better score if it exists or stores the group
					if _, ok := combined[level.Name][group.Name]; ok {
						if combined[level.Name][group.Name].Score < group.Score {
							combined[level.Name][group.Name] = group
						}
					} else {
						combined[level.Name][group.Name] = group
					}
				}
			} else {
				maps[level.Name] = level.Map
				combined[level.Name] = make(map[string]Group)
				for _, group := range level.Groups {
					combined[level.Name][group.Name] = group
				}
			}
		}
	}

	return convertToResult(combined, maps)
}

func verifyLeague(results []Results) {
	league := results[0].League
	for _, result := range results {
		if result.League != league {
			log.Fatalf("error: leagues do not match")
		}
	}
}

func serializeResults(results Results, filename string) {
	original, err := json.Marshal(results)
	if err != nil {
		log.Fatalf("Error serializing results: %v", err)
	}

	var prettyJSON bytes.Buffer
	json.Indent(&prettyJSON, original, "", "\t")

	err = os.WriteFile(filename, prettyJSON.Bytes(), 0644)
	if err != nil {
		log.Fatalf("Error writing file: %v", err)
	}
}

func main() {
	validateArguments()

	var results []Results = readResultFiles(os.Args[2:])
	verifyLeague(results)

	var result Results = combineResults(results)
	result.League = results[0].League
	serializeResults(result, os.Args[1])

	log.Println("Done!")
}

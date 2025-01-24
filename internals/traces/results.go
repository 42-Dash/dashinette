package traces

import (
	"bytes"
	"dashinette/pkg/logger"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
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

// reads a file and returns its content as a slice of strings
func fileToLines(filename string) ([]string, error) {
	content, err := os.ReadFile(filename)

	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(content), "\n")
	if lines[len(lines)-1] == "" {
		lines = lines[:len(lines)-1]
	}

	return lines, nil
}

// serializes the results into a file
func serializeResults(results Results, filename string) error {
	original, _ := json.Marshal(results)

	var prettyJSON bytes.Buffer
	json.Indent(&prettyJSON, original, "", "\t")

	return os.WriteFile(filename, prettyJSON.Bytes(), 0644)
}

// groups the traces by levels
// returns a map where:
// - keys are the level names
// - values are slices of Group structs summarizing all the teams results
func groupByLevels(records map[string]Traces) map[string][]Group {
	levels := make(map[string][]Group)

	for teamName, traces := range records {
		for _, trace := range traces.Grades {
			status := "invalid"
			path := ""
			if trace.Status == "OK" {
				status = "valid"
				path = trace.Path
			}
			levels[trace.StageMap] = append(levels[trace.StageMap], Group{
				Name:   teamName,
				Status: status,
				Score:  trace.Cost,
				Path:   path,
			})
		}
	}

	return levels
}

// parses the map of levels into a slice of Level structs
func parseMapIntoLevel(levels map[string][]Group) ([]Level, error) {
	results := []Level{}

	for levelPath, groups := range levels {
		fmt.Println("groups", groups)
		fmt.Println("filename is", levelPath)

		content, err := fileToLines(levelPath)
		if err != nil {
			logger.Error.Printf("Error reading level file %s: %v", levelPath, err)
			return nil, err
		}
		results = append(results, Level{
			Name:   filepath.Base(levelPath),
			Map:    content,
			Groups: groups,
		})
	}

	return results, nil
}

// parses the generated traces into a Results struct and serializes it into a file
//
// parameters:
// records: a map of team names to their Traces
// league: the league name
// filename: the name of the file to store the results
//
// returns:
// an error if the serialization fails
// prints logs if the parsing fails
func StoreResults(records map[string]Traces, league, filename string) error {
	results := Results{League: league}

	levels := groupByLevels(records)
	parsedLevels, err := parseMapIntoLevel(levels)
	if err != nil {
		return fmt.Errorf("connot parse levels: %v", err)
	}

	results.Levels = parsedLevels
	err = serializeResults(results, filename)

	if err != nil {
		return fmt.Errorf("connot serialize results: %v", err)
	}

	return nil
}

package traces

import (
	"bytes"
	"encoding/json"
	"os"
)

// structure of the generated traces.json file
type StageGrade struct {
	StageMap string `json:"map_path"`
	Cost     int    `json:"cost"`
	Status   string `json:"status"`
	Path     string `json:"path"`
}

type Traces struct {
	Compilation string       `json:"compilation"`
	Grades      []StageGrade `json:"scores"`
}

// contract for the Traces structure
type TracesInterface interface {
	AddCompilation(msg string)
	AddStage(mapName string, output int, status string)
	StoreInFile(path string) error
}

// creates a new Traces structure to store the state of the grading process
func NewLogger() *Traces {
	return &Traces{
		Compilation: "OK",
		Grades:      []StageGrade{},
	}
}

// adds a compilation message to the Traces structure
func (t *Traces) AddCompilation(msg string) {
	t.Compilation = msg
}

// adds a stage to the Traces structure
//
// mapName: the name of the map
// grade: the grade of the stage
// status: the status of the stage
// path: the path to the stage
func (t *Traces) AddStage(mapName string, grade int, status string, path string) {
	t.Grades = append(t.Grades, StageGrade{
		StageMap: mapName,
		Cost:     grade,
		Status:   status,
		Path:     path,
	})
}

// stores the Traces structure in a file
func (t *Traces) StoreInFile(file string) error {
	original, _ := json.Marshal(t)

	var prettyJSON bytes.Buffer
	json.Indent(&prettyJSON, original, "", "\t")

	return os.WriteFile(file, prettyJSON.Bytes(), 0644)
}

// deserializes a Traces structure from a file
func Deserialize(file string) (Traces, error) {
	data, err := os.ReadFile(file)

	if err != nil {
		return Traces{}, err
	}

	var traces Traces
	err = json.Unmarshal(data, &traces)

	if err != nil {
		return Traces{}, err
	}

	return traces, nil
}

// deserializes a Traces structure from a file and returns slice of the maps
func DeserializeMapsOnly(file string) []string {
	traces, err := Deserialize(file)

	if err != nil {
		return nil
	}

	var maps []string
	for _, grade := range traces.Grades {
		maps = append(maps, grade.StageMap)
	}

	return maps
}

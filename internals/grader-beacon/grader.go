package grader

import (
	"bytes"
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/parser"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func compileProject(config TesterConfig) error {
	if fileExists(filepath.Join(config.Args.RepoPath, beacon.EXECUTABLE_NAME)) {
		os.Remove(filepath.Join(config.Args.RepoPath, beacon.EXECUTABLE_NAME))
	}

	if !fileExists(config.Args.RepoPath + "/Makefile") {
		return fmt.Errorf("error: Makefile not found")
	}

	cmd := exec.Command("/usr/bin/make", "-C", config.Args.RepoPath)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	err := cmd.Run()

	if err != nil {
		return fmt.Errorf("error: %v", stderr.String())
	}

	return nil
}

func BeaconMultistageGrader(config TesterConfig) error {
	var outpath string = parser.GetTracesPathContainerized(config.Args.TeamName)

	if fileExists(outpath) {
		os.Remove(outpath)
	}

	tr := NewLogger()
	defer tr.StoreInFile(outpath)

	if err := compileProject(config); err != nil {
		tr.AddCompilation(err.Error())
		return nil
	} else {
		tr.AddCompilation("OK")
	}

	var graderStages []MapConfig
	if config.Args.League == "rookie" {
		graderStages = config.MapsJSON.RookieLeague
	} else {
		graderStages = config.MapsJSON.OpenLeague
	}

	for _, stage := range graderStages {
		output, res, err := "N/A", 1, fmt.Errorf("N/A")
		fmt.Println("Grading stage: ", stage)

		if err == nil {
			tr.AddStage(stage.Paths, res, "OK", output, stage.Beacons)
		} else {
			tr.AddStage(stage.Paths, 0, err.Error(), output, stage.Beacons)
		}
	}

	return nil
}

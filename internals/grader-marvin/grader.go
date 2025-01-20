package grader

import (
	"bytes"
	"dashinette/internals/grader-marvin/open"
	"dashinette/internals/grader-marvin/rookie"
	"dashinette/internals/traces"
	"dashinette/pkg/constants/marvin"
	"dashinette/pkg/parser"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// Returns true if the file exists.
func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// Compiles the project and
func compileProject(config parser.TesterConfig) error {
	if fileExists(filepath.Join(config.Args.RepoPath, marvin.EXECUTABLE_NAME)) {
		os.Remove(filepath.Join(config.Args.RepoPath, marvin.EXECUTABLE_NAME))
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

func selectGradingFunction(league string) func(string, string, int) (string, int, error) {
	switch league {
	case "rookie":
		return rookie.GradeRookieLeagueAssignment
	case "open":
		return open.GradeOpenLeagueAssignment
	default:
		return nil
	}
}

func MarvinMultistageGrader(config parser.TesterConfig) error {
	_, err := os.Stat(parser.GetTracesPath(config.Args.TeamName, marvin.DASH_FOLDER))
	if err == nil {
		os.Remove(parser.GetTracesPath(config.Args.TeamName, marvin.DASH_FOLDER))
	}
	tr := traces.NewLogger()
	defer tr.StoreInFile(parser.GetTracesPathContainerized(config.Args.TeamName))

	if err := compileProject(config); err != nil {
		tr.AddCompilation(err.Error())
		return nil
	} else {
		tr.AddCompilation("OK")
	}

	var gradingFunction = selectGradingFunction(config.Args.League)

	for _, repo := range config.Maps {
		path, res, err := gradingFunction(
			filepath.Join(config.Args.RepoPath, marvin.EXECUTABLE_NAME),
			repo.Path,
			repo.Timeout,
		)
		if err == nil {
			tr.AddStage(repo.Path, res, "OK", path)
		} else {
			tr.AddStage(repo.Path, res, err.Error(), path)
		}
	}

	return nil
}

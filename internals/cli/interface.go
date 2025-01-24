package cli

import (
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/constants/marvin"
	"dashinette/pkg/logger"
	"dashinette/pkg/parser"
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/manifoldco/promptui"
)

// Constants for the different options in the CLI.
const (
	InitializeReposTask         = "Create GitHub Repositories by template"
	UploadReadmesTask           = "Update README files with Subjects"
	GrantCollaboratorAccessTask = "Grant Collaborator Write Access"
	MakeReposReadOnlyTask       = "Configure Repositories as Read-Only"
	AnalyzeSubmissionsTask      = "Clone and Analyze Submissions to Generate Traces"
	UploadTracesTask            = "Parse and Upload Traces to 'traces' Branch"
	GenerateResultsJSONTask     = "Parse Logs and Generate results.json"
	ExitTask                    = "Exit"
)

const (
	MARVIN = "marvin"
	BEACON = "beacon"
)

// getConstants returns the constants for the selected dash.
func getConstants(dash string) map[string]string {
	switch dash {
	case MARVIN:
		return map[string]string{
			"HEADER":        marvin.HEADER_TEMPLATE,
			"TEMPLATE_REPO": marvin.TEMPLATE_REPO,
			"SUBJECT_PATH":  marvin.SUBJECT_PATH,
			"DASH_FOLDER":   marvin.DASH_FOLDER,
			"IMAGE_NAME":    marvin.DOCKER_IMAGE_NAME,
		}
	case BEACON:
		return map[string]string{
			"HEADER":        beacon.HEADER_TEMPLATE,
			"TEMPLATE_REPO": beacon.TEMPLATE_REPO,
			"SUBJECT_PATH":  beacon.SUBJECT_PATH,
			"DASH_FOLDER":   beacon.DASH_FOLDER,
			"IMAGE_NAME":    beacon.DOCKER_IMAGE_NAME,
		}
	default:
		logger.Error.Printf("Invalid dash selected: %s", dash)
		return nil
	}
}

// aprovedAction asks the user if they want to proceed with the action.
func aprovedAction(action string) bool {
	prompt := promptui.Prompt{
		Label:     fmt.Sprintf("Do you want to proceed with %s?", action),
		IsConfirm: true,
	}
	result, err := prompt.Run()
	if err != nil && err.Error() != "" {
		log.Fatal(err)
	}
	if result != "y" {
		logger.Warn.Printf("Skipping %s", action)
		return false
	}
	logger.Info.Printf("Proceeding with %s", action)
	return true
}

// rerenderHeader clears the terminal and prints the header.
func rerenderHeader(header string) {
	cmd := exec.Command("clear")
	cmd.Stdout = os.Stdout
	cmd.Run()

	fmt.Print(header)
}

// InteractiveCLI is the main entry point for the CLI.
//
// Parameters:
//   - filename: The name of the file to load the participants from.
//   - dash: The name of the dash which to use.
//
// The function uses logs to print the status of the operation.
func InteractiveCLI(settings parser.Participants, dash string) {
	constants := getConstants(dash)
	prompt := promptui.Select{
		Label: "Select an action",
		Items: []string{
			InitializeReposTask,
			UploadReadmesTask,
			GrantCollaboratorAccessTask,
			MakeReposReadOnlyTask,
			AnalyzeSubmissionsTask,
			UploadTracesTask,
			GenerateResultsJSONTask,
			ExitTask,
		},
		Size:     10,
		HideHelp: true,
	}
	rerenderHeader(constants["HEADER"])

	loop := true
	for loop {
		_, result, err := prompt.Run()
		if err != nil {
			log.Fatal(err)
		}
		rerenderHeader(constants["HEADER"])

		switch result {
		case InitializeReposTask:
			createRepos(settings, constants["TEMPLATE_REPO"])
		case UploadReadmesTask:
			if aprovedAction("Push subjects") {
				pushSubjects(settings, constants["SUBJECT_PATH"], constants["DASH_FOLDER"])
			}
		case GrantCollaboratorAccessTask:
			addCollaborators(settings)
		case MakeReposReadOnlyTask:
			setReposReadOnly(settings)
		case AnalyzeSubmissionsTask:
			evaluateAssignments(settings, constants["DASH_FOLDER"], constants["IMAGE_NAME"])
		case UploadTracesTask:
			if aprovedAction("Push traces") {
				pushTraces(settings, constants["DASH_FOLDER"], dash)
			}
		case GenerateResultsJSONTask:
			createResults(settings, constants["DASH_FOLDER"], dash)
		case ExitTask:
			loop = false
		}
		logger.Flush()
	}
	logger.Info.Println("Session is over")
}

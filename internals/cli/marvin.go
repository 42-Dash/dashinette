package cli

import (
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
	MarvinInitializeReposTask         = "Create GitHub Repositories by template"
	MarvinUploadReadmesTask           = "Update README files with Subjects"
	MarvinGrantCollaboratorAccessTask = "Grant Collaborator Write Access"
	MarvinMakeReposReadOnlyTask       = "Configure Repositories as Read-Only"
	MarvinAnalyzeSubmissionsTask      = "Clone and Analyze Submissions to Generate Traces"
	MarvinUploadTracesTask            = "Parse and Upload Traces to 'traces' Branch"
	MarvinGenerateResultsJSONTask     = "Parse Logs and Generate results.json"
	MarvinExitTask                    = "Exit"
)

// headerTemplate is the template for the header of the CLI.
const marvinHeaderTemplate = `+---------------------------------------------+
|    __  __                  _                |
|    |  \/  |                (_)              |
|    | \  / | __ _ _ ____   ___ _ __          |
|    | |\/| |/ _`+"`"+` | '__\ \ / / | '_ \         |
|    | |  | | (_| | |   \ V /| | | | |        |
|    |_|  |_|\__,_|_|    \_/ |_|_| |_|        |
+---------------------------------------------+
|    Welcome to the Marvin Dash CLI           |
+---------------------------------------------+
`

// rerenderHeader clears the terminal and prints the header.
func rerenderHeader(header string) {
	cmd := exec.Command("clear")
	cmd.Stdout = os.Stdout
	cmd.Run()

	fmt.Print(header)
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

// InteractiveCLI is the main entry point for the CLI.
//
// Parameters:
//   - filename: The name of the file to load the participants from.
//
// The function uses logs to print the status of the operation.
func MarvinInteractiveCLI(settings parser.Participants) {
	prompt := promptui.Select{
		Label: "Select an action",
		Items: []string{
			MarvinInitializeReposTask,
			MarvinUploadReadmesTask,
			MarvinGrantCollaboratorAccessTask,
			MarvinMakeReposReadOnlyTask,
			MarvinAnalyzeSubmissionsTask,
			MarvinUploadTracesTask,
			MarvinGenerateResultsJSONTask,
			MarvinExitTask,
		},
		Size:     10,
		HideHelp: true,
	}
	rerenderHeader(marvinHeaderTemplate)

	loop := true
	for loop {
		_, result, err := prompt.Run()
		if err != nil {
			log.Fatal(err)
		}
		rerenderHeader(marvinHeaderTemplate)

		switch result {
		case MarvinInitializeReposTask:
			createRepos(settings, marvin.TEMPLATE_REPO)
		case MarvinUploadReadmesTask:
			if aprovedAction("Push subjects") {
				pushSubjects(settings, marvin.SUBJECT_PATH)
			}
		case MarvinGrantCollaboratorAccessTask:
			addCollaborators(settings)
		case MarvinMakeReposReadOnlyTask:
			setReposReadOnly(settings)
		case MarvinAnalyzeSubmissionsTask:
			evaluateAssignments(settings)
		case MarvinUploadTracesTask:
			if aprovedAction("Push traces") {
				pushTraces(settings)
			}
		case MarvinGenerateResultsJSONTask:
			createResults(settings)
		case MarvinExitTask:
			loop = false
		}
		logger.Flush()
	}
	logger.Info.Println("Session is over")
}

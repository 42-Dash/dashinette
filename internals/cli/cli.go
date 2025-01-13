package cli

import (
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

// headerTemplate is the template for the header of the CLI.
const headerTemplate = `+---------------------------------------------+
|    __  __                  _                |
|    |  \/  |                (_)              |
|    | \  / | __ _ _ ____   ___ _ __          |
|    | |\/| |/ _`+"`"+` | '__\ \ / / | '_ \         |
|    | |  | | (_| | |   \ V /| | | | |        |
|    |_|  |_|\__,_|_|    \_/ |_|_| |_|        |
+---------------------------------------------+
|    Welcome to the Marvin Dah CLI            |
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
func InteractiveCLI(settings parser.Participants) {
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
	rerenderHeader(headerTemplate)

	loop := true
	for loop {
		_, result, err := prompt.Run()
		if err != nil {
			log.Fatal(err)
		}
		rerenderHeader(headerTemplate)

		switch result {
		case InitializeReposTask:
			createRepos(settings)
		case UploadReadmesTask:
			if aprovedAction("Push subjects") {
				pushSubjects(settings)
			}
		case GrantCollaboratorAccessTask:
			addCollaborators(settings)
		case MakeReposReadOnlyTask:
			setReposReadOnly(settings)
		case AnalyzeSubmissionsTask:
			evaluateAssignments(settings)
		case UploadTracesTask:
			if aprovedAction("Push traces") {
				pushTraces(settings)
			}
		case GenerateResultsJSONTask:
			createResults(settings)
		case ExitTask:
			loop = false
		}
		logger.Flush()
	}
	logger.Info.Println("Session is over")
}

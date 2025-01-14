package cli

import (
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/logger"
	"dashinette/pkg/parser"
	"log"

	"github.com/manifoldco/promptui"
)

// Constants for the different options in the CLI.
const (
	BeaconInitializeReposTask         = "Create GitHub Repositories by template"
	BeaconUploadReadmesTask           = "Update README files with Subjects"
	BeaconGrantCollaboratorAccessTask = "Grant Collaborator Write Access"
	BeaconMakeReposReadOnlyTask       = "Configure Repositories as Read-Only"
	BeaconAnalyzeSubmissionsTask      = "Clone and Analyze Submissions to Generate Traces"
	BeaconUploadTracesTask            = "Parse and Upload Traces to 'traces' Branch"
	BeaconGenerateResultsJSONTask     = "Parse Logs and Generate results.json"
	BeaconExitTask                    = "Exit"
)

// headerTemplate is the template for the header of the CLI.
const beaconHeaderTemplate = `+---------------------------------------------+
|    ____                                     |
|    |  _ \                                   |
|    | |_) | ___  __ _  ___ ___  _ __         |
|    |  _ < / _ \/ _` + "`" + ` |/ __/ _ \| '_ \        |
|    | |_) |  __/ (_| | (_| (_) | | | |       |
|    |____/ \___|\__,_|\___\___/|_| |_|       |
+---------------------------------------------+
|    Welcome to the Beacon Dash CLI           |
+---------------------------------------------+
`

// InteractiveCLI is the main entry point for the CLI.
//
// Parameters:
//   - filename: The name of the file to load the participants from.
//
// The function uses logs to print the status of the operation.
func BeaconInteractiveCLI(settings parser.Participants) {
	prompt := promptui.Select{
		Label: "Select an action",
		Items: []string{
			BeaconInitializeReposTask,
			BeaconUploadReadmesTask,
			BeaconGrantCollaboratorAccessTask,
			BeaconMakeReposReadOnlyTask,
			BeaconAnalyzeSubmissionsTask,
			BeaconUploadTracesTask,
			BeaconGenerateResultsJSONTask,
			BeaconExitTask,
		},
		Size:     10,
		HideHelp: true,
	}
	rerenderHeader(beaconHeaderTemplate)

	loop := true
	for loop {
		_, result, err := prompt.Run()
		if err != nil {
			log.Fatal(err)
		}
		rerenderHeader(beaconHeaderTemplate)

		switch result {
		case BeaconInitializeReposTask:
			createRepos(settings, beacon.TEMPLATE_REPO)
		case BeaconUploadReadmesTask:
			if aprovedAction("Push subjects") {
				pushSubjects(settings, beacon.SUBJECT_PATH)
			}
		case BeaconGrantCollaboratorAccessTask:
			addCollaborators(settings)
		case BeaconMakeReposReadOnlyTask:
			setReposReadOnly(settings)
		case BeaconAnalyzeSubmissionsTask:
			beaconEvaluateAssignments(settings)
		case BeaconUploadTracesTask:
			if aprovedAction("Push traces") {
				pushTraces(settings)
			}
		case BeaconGenerateResultsJSONTask:
			createResults(settings)
		case BeaconExitTask:
			loop = false
		}
		logger.Flush()
	}
	logger.Info.Println("Session is over")
}

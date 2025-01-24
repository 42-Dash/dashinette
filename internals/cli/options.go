package cli

import (
	beaconTraces "dashinette/internals/grader-beacon"
	"dashinette/internals/traces"
	"dashinette/pkg/containerization"
	"dashinette/pkg/github"
	"dashinette/pkg/logger"
	"dashinette/pkg/parser"
	"fmt"
)

func createRepos(participants parser.Participants, templateRepo string) {
	for _, team := range participants.Teams {
		err := github.CreateRepoFromTemplate(team.Name, templateRepo, true)
		if err != nil {
			logger.Error.Printf("Error creating repo for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully created repo for team %s", team.Name)
		}
	}
}

func addCollaborators(participants parser.Participants) {
	for _, team := range participants.Teams {
		err := github.SetCollaborators(team.Name, team.Nicknames, github.PUSH)
		if err != nil {
			logger.Error.Printf("Error adding collaborators to team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully added collaborators to team %s", team.Name)
		}
	}
}

func cloneRepos(participants parser.Participants, dashFolder string) (ok bool) {
	ok = true
	for _, team := range participants.Teams {
		err := github.CloneRepo(team.Name, parser.GetRepoPath(team.Name, dashFolder))
		if err != nil {
			logger.Error.Printf("Error cloning repo for team %s: %v", team.Name, err)
			ok = false
		} else {
			logger.Info.Printf("Successfully cloned repo for team %s", team.Name)
		}
	}
	return
}

func pushSubjects(participants parser.Participants, subject, dashFolder string) {
	if !cloneRepos(participants, dashFolder) {
		logger.Error.Println("Error cloning repos, cannot push subjects")
		return
	}
	for _, team := range participants.Teams {
		err := github.UploadFileToRoot(
			parser.GetRepoPath(team.Name, dashFolder),
			[]string{subject},
			"add subject",
			"main",
			false,
		)
		if err != nil {
			logger.Error.Printf("Error pushing subjects for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully pushed subjects for team %s", team.Name)
		}
	}
}

func evaluateAssignments(participants parser.Participants, dashFolder, imageName string) {
	if !cloneRepos(participants, dashFolder) {
		logger.Error.Println("Error cloning repos, cannot push traces")
		return
	}
	for _, team := range participants.Teams {
		err := containerization.GradeAssignmentInContainer(
			team,
			parser.GetRepoPath(team.Name, dashFolder),
			parser.GetTracesPath(team.Name, dashFolder),
			imageName,
			dashFolder,
		)
		if err != nil {
			logger.Error.Printf("Error grading works for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully graded works for team %s", team.Name)
		}
	}
}

func pushTraces(participants parser.Participants, dashFolder string, dash string) {
	for _, team := range participants.Teams {
		var files []string
		if dash == MARVIN {
			files = append(
				traces.DeserializeMapsOnly(parser.GetTracesPath(team.Name, dashFolder)),
				parser.GetTracesPath(team.Name, dashFolder),
			)
		} else if dash == BEACON {
			files = append(
				beaconTraces.DeserializeMapsOnly(parser.GetTracesPath(team.Name, dashFolder)),
				parser.GetTracesPath(team.Name, dashFolder),
			)
		} else {
			logger.Error.Printf("Logic for %s not implemented", dash)
		}

		err := github.UploadFileToRoot(
			parser.GetRepoPath(team.Name, dashFolder),
			files,
			"Upload traces",
			"traces",
			true,
		)
		if err != nil {
			logger.Error.Printf("Error pushing traces for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully pushed traces for team %s", team.Name)
		}
	}
}

func setReposReadOnly(participants parser.Participants) {
	for _, team := range participants.Teams {
		err := github.SetCollaborators(team.Name, team.Nicknames, github.READ)
		if err != nil {
			logger.Error.Printf("Error restricting collaborators for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully restricted collaborators for team %s", team.Name)
		}
	}
}

func createResults(participants parser.Participants, dashFolder string, dash string) {
	if dash == MARVIN {
		createResultsMarvin(participants, dashFolder)
	} else if dash == BEACON {
		createResultsBeacon(participants, dashFolder)
	} else {
		logger.Error.Printf("Logic for %s not implemented", dash)
	}
}

func createResultsBeacon(participants parser.Participants, dashFolder string) {
	var resultsRookie = make(map[string]beaconTraces.Traces)
	var resultsOpen = make(map[string]beaconTraces.Traces)

	for _, team := range participants.Teams {
		record, err := beaconTraces.Deserialize(parser.GetTracesPath(team.Name, dashFolder))
		if err != nil {
			logger.Error.Printf("Error deserializing traces for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully deserialized traces for team %s", team.Name)
		}
		if team.League == "rookie" {
			resultsRookie[team.Name] = record
		} else {
			resultsOpen[team.Name] = record
		}
	}

	err := beaconTraces.StoreResults(resultsRookie, "Rookie League", "rookie_results.json")
	if err != nil {
		logger.Error.Printf("Error storing results for rookie league: %v", err)
	} else {
		logger.Info.Println("Successfully stored results for rookie league")
	}

	err = beaconTraces.StoreResults(resultsOpen, "Open League", "open_results.json")
	if err != nil {
		logger.Error.Printf("Error storing results for open league: %v", err)
	} else {
		logger.Info.Println("Successfully stored results for open league")
	}
}

func createResultsMarvin(participants parser.Participants, dashFolder string) {
	var resultsRookie = make(map[string]traces.Traces)
	var resultsOpen = make(map[string]traces.Traces)

	for _, team := range participants.Teams {
		record, err := traces.Deserialize(parser.GetTracesPath(team.Name, dashFolder))
		if err != nil {
			logger.Error.Printf("Error deserializing traces for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully deserialized traces for team %s", team.Name)
		}
		if team.League == "rookie" {
			resultsRookie[team.Name] = record
		} else {
			resultsOpen[team.Name] = record
		}
	}

	fmt.Println("resultsRookie", resultsRookie)
	fmt.Println("resultsOpen", resultsOpen)

	err := traces.StoreResults(resultsRookie, "Rookie League", "rookie_results.json")
	if err != nil {
		logger.Error.Printf("Error storing results for rookie league: %v", err)
	} else {
		logger.Info.Println("Successfully stored results for rookie league")
	}

	err = traces.StoreResults(resultsOpen, "Open League", "open_results.json")
	if err != nil {
		logger.Error.Printf("Error storing results for open league: %v", err)
	} else {
		logger.Info.Println("Successfully stored results for open league")
	}
}

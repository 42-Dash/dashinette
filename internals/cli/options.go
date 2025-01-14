package cli

import (
	"dashinette/internals/traces"
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/constants/marvin"
	"dashinette/pkg/containerization"
	"dashinette/pkg/github"
	"dashinette/pkg/logger"
	"dashinette/pkg/parser"
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

func cloneRepos(participants parser.Participants) (ok bool) {
	ok = true
	for _, team := range participants.Teams {
		err := github.CloneRepo(team.Name, parser.GetRepoPath(team.Name))
		if err != nil {
			logger.Error.Printf("Error cloning repo for team %s: %v", team.Name, err)
			ok = false
		} else {
			logger.Info.Printf("Successfully cloned repo for team %s", team.Name)
		}
	}
	return
}

func pushSubjects(participants parser.Participants, subject string) {
	if !cloneRepos(participants) {
		logger.Error.Println("Error cloning repos, cannot push subjects")
		return
	}
	for _, team := range participants.Teams {
		err := github.UploadFileToRoot(
			parser.GetRepoPath(team.Name),
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

func marvinEvaluateAssignments(participants parser.Participants) {
	if !cloneRepos(participants) {
		logger.Error.Println("Error cloning repos, cannot push traces")
		return
	}
	for _, team := range participants.Teams {
		err := containerization.GradeAssignmentInContainer(
			team,
			parser.GetRepoPath(team.Name),
			parser.GetTracesPath(team.Name),
			marvin.DOCKER_IMAGE_NAME,
			beacon.DASH_FOLDER,
		)
		if err != nil {
			logger.Error.Printf("Error grading works for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully graded works for team %s", team.Name)
		}
	}
}

func beaconEvaluateAssignments(participants parser.Participants) {
	if !cloneRepos(participants) {
		logger.Error.Println("Error cloning repos, cannot push traces")
		return
	}
	for _, team := range participants.Teams {
		err := containerization.GradeAssignmentInContainer(
			team,
			parser.GetRepoPath(team.Name),
			parser.GetTracesPath(team.Name),
			beacon.DOCKER_IMAGE_NAME,
			beacon.DASH_FOLDER,
		)
		if err != nil {
			logger.Error.Printf("Error grading works for team %s: %v", team.Name, err)
		} else {
			logger.Info.Printf("Successfully graded works for team %s", team.Name)
		}
	}
}

func pushTraces(participants parser.Participants) {
	for _, team := range participants.Teams {
		err := github.UploadFileToRoot(
			parser.GetRepoPath(team.Name),
			append(
				traces.DeserializeMapsOnly(parser.GetTracesPath(team.Name)),
				parser.GetTracesPath(team.Name),
			),
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

func createResults(participants parser.Participants) {
	var resultsRookie = make(map[string]traces.Traces)
	var resultsOpen = make(map[string]traces.Traces)

	for _, team := range participants.Teams {
		record, err := traces.Deserialize(parser.GetTracesPath(team.Name))
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

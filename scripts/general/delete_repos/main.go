package main

import (
	"bufio"
	"dashinette/pkg/constants/marvin"
	"dashinette/pkg/github"
	"dashinette/pkg/parser"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func confirmation() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Are you sure you want to remove the organization repositories? (yes/no): ")
	response, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Error reading input:", err)
		os.Exit(0)
	}

	response = strings.TrimSpace(strings.ToLower(response))
	if response != "yes" {
		fmt.Println("Action canceled.")
		os.Exit(0)
	}

	fmt.Println("Proceeding with the action...")
}

func main() {
	participants, err := parser.LoadParticipantsJSON(marvin.PARTICIPANTS_CONFIG_FILE)
	if err != nil {
		log.Fatalf("Error loading participants: %v", err)
	}
	confirmation()
	deleteRepos(participants)
}

// Checks if all required environment variables are set.
func init() {
	err := godotenv.Load("config/.env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	var variables []string = []string{
		"GITHUB_ACCESS",
		"GITHUB_ORGANISATION",
	}

	for _, env := range variables {
		if os.Getenv(env) == "" {
			log.Fatalf("Error: %s not found in .env", env)
		}
	}
}

// Loads the participants from the given file and deletes the repositories.
//
// Parameters:
//   - filename: The name of the file to load the participants from.
//
// The function uses logs to print the status of the operation.
func deleteRepos(participants parser.Participants) {
	for _, team := range participants.Teams {
		err := github.DeleteRepo(team.Name)
		if err != nil {
			log.Printf("Error deleting repo for team %s: %v", team.Name, err)
		} else {
			log.Printf("Successfully deleted repo for team %s", team.Name)
		}
	}
}

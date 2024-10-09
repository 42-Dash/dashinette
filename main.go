package main

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"teste/cmd/scripts"
)

const participantsFile = "participants.json"

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("Usage: %s [create|delete]", os.Args[0])
	}
	switch os.Args[1] {
	case "create":
		scripts.LoadParticipantsAndCreateRepos(participantsFile)
	case "delete":
		scripts.LoadParticipantsAndDeleteRepos(participantsFile)
	default:
		log.Fatalf("Usage: %s [create|delete]", os.Args[0])
	}
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	const (
		access = "GITHUB_ACCESS"
		org    = "GITHUB_ORGANISATION"
	)

	for _, env := range []string{access, org} {
		if os.Getenv(env) == "" {
			log.Fatalf("Error: %s not found in .env", env)
		}
	}
}

package main

import (
	"dashinette/internals/cli"
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/logger"
	"dashinette/pkg/parser"
	"log"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
)

// Main function to start the CLI.
// It prompts the user to enter the path to the participants file.
// Then it loads the participants and starts the interactive CLI.
func main() {
	participants, err := parser.LoadParticipantsJSON()
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	logger.InitLogger()
	defer logger.CloseFile()

	cli.BeaconInteractiveCLI(participants)
}

// Checks if all required environment variables are set.
func init() {
	err := godotenv.Load(beacon.DOTENV_PATH)
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	for _, env := range beacon.REQUIRED_ENVS {
		if os.Getenv(env) == "" {
			log.Fatalf("Error: %s not found in .env", env)
		}
	}

	var imageName string = beacon.DOCKER_IMAGE_NAME

	log.Printf("Building docker image %s...", imageName)
	buildCmd := exec.Command("docker", "build", "-t", imageName, "-f", beacon.DOCKERFILE_NAME, ".")
	buildCmd.Stdout = os.Stdout
	buildCmd.Stderr = os.Stderr
	if err := buildCmd.Run(); err != nil {
		log.Fatalf("Failed to build Docker image %s: %v", imageName, err)
	}
}

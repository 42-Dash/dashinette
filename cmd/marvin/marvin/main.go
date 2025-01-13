package main

import (
	"dashinette/internals/cli"
	"dashinette/pkg/constants/marvin"
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

	cli.MarvinInteractiveCLI(participants)
}

// Checks if all required environment variables are set.
func init() {
	err := godotenv.Load(marvin.DOTENV_PATH)
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	for _, env := range marvin.REQUIRED_ENVS {
		if os.Getenv(env) == "" {
			log.Fatalf("Error: %s not found in .env", env)
		}
	}

	log.Printf("Building docker image %s...", marvin.DOCKER_IMAGE_NAME)
	buildCmd := exec.Command("docker", "build", "-t", marvin.DOCKER_IMAGE_NAME, "-f", marvin.DOCKERFILE_NAME, ".")
	buildCmd.Stdout = os.Stdout
	buildCmd.Stderr = os.Stderr
	if err := buildCmd.Run(); err != nil {
		log.Fatalf("Failed to build Docker image %s: %v", marvin.DOCKER_IMAGE_NAME, err)
	}
}

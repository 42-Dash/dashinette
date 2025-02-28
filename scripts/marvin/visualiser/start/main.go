package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

const DOCKERFILE_PATH = "dashes/marvin/visualiser/"
const DOCKER_IMAGE_NAME = "marvin-visualiser"
const DOCKER_CONTAINER_PREFIX = "visualiser"

var (
	port          string
	resultFile    string
	containerName string
)

func createDockerImage() {
	log.Printf("Building docker image %s...", DOCKER_IMAGE_NAME)
	buildCmd := exec.Command("docker", "build", "-t", DOCKER_IMAGE_NAME, ".")
	buildCmd.Stdout = os.Stdout
	buildCmd.Stderr = os.Stderr
	buildCmd.Dir = DOCKERFILE_PATH

	if err := buildCmd.Run(); err != nil {
		log.Fatalf("Failed to build Docker image %s: %v", DOCKER_IMAGE_NAME, err)
	}
}

func runDockerContainer() {
	log.Printf("Running docker container %s...", DOCKER_IMAGE_NAME)
	runCmd := exec.Command(
		"docker", "run",
		"--detach",
		"--publish", port+":8080",
		"--name", containerName,
		DOCKER_IMAGE_NAME,
	)
	runCmd.Stdout = os.Stdout
	runCmd.Stderr = os.Stderr
	if err := runCmd.Run(); err != nil {
		log.Fatalf("Failed to run Docker container %s: %v", DOCKER_IMAGE_NAME, err)
	}
}

func copyFileToDockerDirectory() {
	copyCmd := exec.Command("cp", resultFile, DOCKERFILE_PATH+"results.json")
	copyCmd.Stdout = os.Stdout
	copyCmd.Stderr = os.Stderr
	if err := copyCmd.Run(); err != nil {
		log.Fatalf("Failed to copy file to container %s: %v", DOCKER_IMAGE_NAME, err)
	}
}

func main() {
	copyFileToDockerDirectory()
	createDockerImage()
	runDockerContainer()

	fmt.Printf("\n\033[32mVisualiser is running at http://localhost:%s\033[0m\n", port)
	fmt.Printf("Container name: \033[32m%s\033[0m\n", containerName)
}

func init() {
	if len(os.Args) != 3 {
		log.Fatalf("Usage: ./main <result-file.json> <port>")
	}
	resultFile = os.Args[1]
	if _, err := os.Stat(resultFile); err != nil {
		log.Fatalf("Error: %v", err)
	}
	port = os.Args[2]
	if _, err := os.Stat(DOCKERFILE_PATH); err != nil {
		log.Fatalf("Error: %v", err)
	}
	containerName = DOCKER_CONTAINER_PREFIX + port
}

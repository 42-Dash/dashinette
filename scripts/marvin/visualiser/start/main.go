package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

const DOCKERFILE_PATH = "dashes/marvin/visualiser/"
const DOCKER_IMAGE_NAME = "dashinette-visualiser"
const DOCKER_CONTAINER_NAME = "visualiser"

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
		"--publish", "8080:8080",
		"--name", DOCKER_CONTAINER_NAME,
		DOCKER_IMAGE_NAME,
	)
	runCmd.Stdout = os.Stdout
	runCmd.Stderr = os.Stderr
	if err := runCmd.Run(); err != nil {
		log.Fatalf("Failed to run Docker container %s: %v", DOCKER_IMAGE_NAME, err)
	}
}

func copyFileToDockerDirectory() {
	copyCmd := exec.Command("cp", os.Args[1], DOCKERFILE_PATH+"/results.json")
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

	fmt.Println("\n\033[32mVisualiser is running at http://localhost:8080\033[0m")
	fmt.Println("Container name:", "\033[32m", DOCKER_CONTAINER_NAME, "\033[0m")
}

func init() {
	if len(os.Args) != 2 {
		log.Fatalf("Usage: ./main <result-file.json>")
	}
	if _, err := os.Stat(os.Args[1]); err != nil {
		log.Fatalf("Error: %v", err)
	}
	if _, err := os.Stat(DOCKERFILE_PATH); err != nil {
		log.Fatalf("Error: %v", err)
	}
}

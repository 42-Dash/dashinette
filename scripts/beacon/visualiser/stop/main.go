package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

const DOCKER_CONTAINER_PREFIX = "visualiser"

var (
	containerName string
)

func stopDockerContainer() {
	log.Printf("Stopping docker container %s...", containerName)
	stopCmd := exec.Command("docker", "stop", containerName)
	stopCmd.Stdout = os.Stdout
	stopCmd.Stderr = os.Stderr
	if err := stopCmd.Run(); err != nil {
		log.Fatalf("Failed to stop Docker container %s: %v", containerName, err)
	}
}

func removeTheContainer() {
	log.Printf("Removing docker container %s...", containerName)
	removeCmd := exec.Command("docker", "rm", containerName)
	removeCmd.Stdout = os.Stdout
	removeCmd.Stderr = os.Stderr
	if err := removeCmd.Run(); err != nil {
		log.Fatalf("Failed to remove Docker container %s: %v", containerName, err)
	}
}

func main() {
	stopDockerContainer()
	removeTheContainer()

	fmt.Println("\n\033[32mVisualiser stopped and removed.\033[0m")
}

func init() {
	if len(os.Args) != 2 {
		log.Fatalf("Usage: ./main <port to stop>")
	}
	containerName = DOCKER_CONTAINER_PREFIX + os.Args[1]
}

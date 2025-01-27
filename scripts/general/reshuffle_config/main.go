package main

import (
	"bytes"
	"dashinette/pkg/parser"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
)

var (
	resultsFile    string
	outputFilename string
)

func readParticipants() parser.Participants {
	file, err := os.Open(resultsFile)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	defer file.Close()

	var participants parser.Participants
	if err := json.NewDecoder(file).Decode(&participants); err != nil {
		log.Fatalf("error: %v", err)
	}

	return participants
}

func reshuffle(participants parser.Participants) parser.Participants {
	for i := range participants.Teams {
		j := rand.Intn(i + 1)
		participants.Teams[i], participants.Teams[j] = participants.Teams[j], participants.Teams[i]
	}
	return participants
}

func storeResults(participants parser.Participants) {
	original, _ := json.Marshal(participants)

	var prettyJSON bytes.Buffer
	json.Indent(&prettyJSON, original, "", "\t")

	if err := os.WriteFile(outputFilename, prettyJSON.Bytes(), 0644); err != nil {
		log.Fatalf("error: %v", err)
	}
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil
}

func main() {
	participants := readParticipants()
	storeResults(reshuffle(participants))
}

func init() {
	fmt.Println("Reshuffle config")
	if len(os.Args) != 3 {
		log.Fatal("usage: ./main <results file.json> <output filename.json>")
	}

	if !fileExists(os.Args[1]) {
		log.Fatalf("error: file %s does not exist", os.Args[1])
	}

	resultsFile = os.Args[1]
	outputFilename = os.Args[2]
}

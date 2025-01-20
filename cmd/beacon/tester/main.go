package main

import (
	"dashinette/internals/grader-beacon"
	"log"
	"os"
)

// {"teamname":"The-Avengers2","repo":"repo/The-Avengers2","league":"open"}

func main() {
	if len(os.Args) == 2 {
		config, err := grader.DeserializeConfig([]byte(os.Args[1]))
		if err != nil {
			log.Fatalf("Error: %v", err)
		}
		if err = grader.BeaconMultistageGrader(config); err != nil {
			log.Fatalf("Error: %v", err)
		}
	} else {
		log.Fatalf("Error: wrong number of arguments")
	}
}

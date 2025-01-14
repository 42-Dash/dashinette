package main

import (
	"dashinette/internals/grader"
	"dashinette/pkg/parser"
	"log"
	"os"
)

func main() {
	if len(os.Args) == 2 {
		config, err := parser.DeserializeTesterConfig([]byte(os.Args[1]))
		if err != nil {
			log.Fatalf("Error: %v", err)
		}
		grader.MultistageGraderWithTraces(config)
	} else {
		log.Fatalf("Error: wrong number of arguments")
	}
}

package main

import (
	"bytes"
	"fmt"
	"log"
	"math/rand"
	"os"
)

var (
	rows, cols        int
	min, max          int
	nodes             int
	printSolution     bool = false
	filename_template string
)

func createGrid() [][]rune {
	grid := make([][]rune, rows)

	for i := range grid {
		grid[i] = make([]rune, cols)
		for j := range grid[i] {
			grid[i][j] = rune(rand.Intn(max-min+1) + min + '0')
		}
	}

	for i := 0; i < nodes; i++ {
		randRow, randCol := rand.Intn(rows), rand.Intn(cols)
		for grid[randRow][randCol] == '*' {
			randRow, randCol = rand.Intn(rows), rand.Intn(cols)
		}
		grid[randRow][randCol] = '*'
	}

	return grid
}

func storeSolution(grid [][]rune, filename string) {
	if printSolution {
		for _, row := range grid {
			fmt.Println(string(row))
		}
		fmt.Println()
	} else {
		var buffer bytes.Buffer
		for _, row := range grid {
			buffer.WriteString(string(row))
			buffer.WriteString("\n")
		}

		if err := os.WriteFile(filename, buffer.Bytes(), 0644); err != nil {
			log.Fatal(err)
		}
	}
}

func main() {
	for iter := 0; iter < 4; iter++ {
		filename := fmt.Sprintf("%s_%d.txt", filename_template, iter)
		content := createGrid()
		storeSolution(content, filename)
	}
}

func init() {
	if len(os.Args) != 4 && len(os.Args) != 5 {
		log.Fatal("Usage: ./main [rows:cols] [distribution min:max] [number of nodes] <output_file_name without extension>")
	}

	if _, err := fmt.Sscanf(os.Args[1], "%d:%d", &rows, &cols); err != nil {
		log.Fatal("Invalid rows:cols format")
	}

	if _, err := fmt.Sscanf(os.Args[2], "%d:%d", &min, &max); err != nil {
		log.Fatal("Invalid distribution format")
	}

	if _, err := fmt.Sscanf(os.Args[3], "%d", &nodes); err != nil {
		log.Fatal("Invalid rate format")
	}

	if min > max || min < 1 || max > 9 {
		log.Fatal("Invalid distribution range")
	}

	if nodes > rows*cols {
		log.Fatal("Rate cannot be greater than rows*cols")
	}

	if len(os.Args) == 5 {
		filename_template = os.Args[4]
	} else {
		printSolution = true
	}
}

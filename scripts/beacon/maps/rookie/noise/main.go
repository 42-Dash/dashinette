package main

import (
	"bytes"
	"fmt"
	"log"
	"math/rand"
	"os"
)

var (
	rows, cols    int
	nodes         int
	printSolution bool = false
	filename      string
)

func createGrid() [][]rune {
	grid := make([][]rune, rows)

	for i := range grid {
		grid[i] = make([]rune, cols)
		for j := range grid[i] {
			grid[i][j] = '.'
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

func storeSolution(grid [][]rune) {
	if printSolution {
		for _, row := range grid {
			fmt.Println(string(row))
		}
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
	content := createGrid()
	storeSolution(content)
}

func init() {
	if len(os.Args) != 3 && len(os.Args) != 4 {
		log.Fatal("Usage: ./main [rows:cols] [number of nodes] <output_file_name>")
	}

	if _, err := fmt.Sscanf(os.Args[1], "%d:%d", &rows, &cols); err != nil {
		log.Fatal("Invalid rows:cols format")
	}

	if _, err := fmt.Sscanf(os.Args[2], "%d", &nodes); err != nil {
		log.Fatal("Invalid rate format")
	}

	if nodes > rows*cols {
		log.Fatal("Rate cannot be greater than rows*cols")
	}

	if len(os.Args) == 4 {
		filename = os.Args[3]
	} else {
		printSolution = true
	}
}

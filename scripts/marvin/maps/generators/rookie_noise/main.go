package main

import (
	utils "dashinette/scripts/marvin/maps/generators"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strings"
)

var (
	rows, cols           int
	min, max             int
	start_row, start_col int
	goal_row, goal_col   int
	printSolution        bool
	filename             string
)

func generateRookieMap() string {
	var content strings.Builder = strings.Builder{}

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			if j == start_col && i == start_row {
				content.WriteRune('M')
			} else if j == goal_col && i == goal_row {
				content.WriteRune('G')
			} else {
				random := rand.Intn(max-min+1) + min
				content.WriteByte(byte('0' + random))
			}
		}
		content.WriteString("\n")
	}

	return content.String()
}

func main() {
	content := generateRookieMap()

	if printSolution {
		fmt.Print(content)
	} else {
		err := os.WriteFile(filename, []byte(content), 0644)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Done!")
	}
}

func init() {
	if len(os.Args) != 5 && len(os.Args) != 6 {
		log.Fatal("Usage: ./map_generator [size rows:cols] [range min:max] [start position row:col] <output_file_name>")
	}

	utils.ParseArr(os.Args[1], ":", &rows, &cols)
	utils.ParseArr(os.Args[2], ":", &min, &max)
	utils.ParseArr(os.Args[3], ":", &start_row, &start_col)
	utils.ParseArr(os.Args[4], ":", &goal_row, &goal_col)

	if min < 1 || max > 9 || min > max {
		log.Fatal("Min and max must be between 1 and 9 and min must be less than max")
	}

	if rows < 1 || cols < 1 || rows*cols < 2 {
		log.Fatal("Rows and cols must be greater than 1")
	}

	if start_row < 0 {
		start_row = rows + start_row
	}

	if start_col < 0 {
		start_col = cols + start_col
	}

	if goal_row < 0 {
		goal_row = rows + goal_row
	}

	if goal_col < 0 {
		goal_col = cols + goal_col
	}

	if start_row < 0 || start_row >= rows || start_col < 0 || start_col >= cols {
		log.Fatal("Position of Marvin is out of bounds")
	}

	if goal_row < 0 || goal_row >= rows || goal_col < 0 || goal_col >= cols {
		log.Fatal("Position of goal is out of bounds")
	}

	if start_row == goal_row && start_col == goal_col {
		log.Fatal("Start should not be equal to goal")
	}

	if len(os.Args) == 5 {
		printSolution = true
	} else {
		filename = os.Args[5]
	}
}

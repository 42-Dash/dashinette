package main

import (
	"fmt"
	"image/png"
	"log"
	"os"
	"strings"
)

var (
	rows, cols    int
	inverted      bool
	imageFile     string
	printSolution bool
	filename      string
)

func readImage() ([][]bool, int) {
	ans := [][]bool{}
	beacons := 0

	file, err := os.Open(imageFile)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	img, err := png.Decode(file)
	if err != nil {
		log.Fatal(err)
	}

	bounds := img.Bounds()
	width, heights := bounds.Max.X, bounds.Max.Y

	for i := 0; i < rows; i++ {
		line := []bool{}
		for j := 0; j < cols; j++ {
			r, g, b, _ := img.At(j*width/cols, i*heights/rows).RGBA()
			r, g, b = r/257, g/257, b/257
			beacon := (r + g + b) > ((255 * 3) / 2)
			if beacon != inverted {
				line = append(line, true)
				beacons++
			} else {
				line = append(line, false)
			}
		}
		ans = append(ans, line)
	}

	if beacons < 2 || beacons >= rows*cols-2 {
		log.Fatal("Invalid number of beacons")
	}

	return ans, beacons
}

func generateMap(surfaces [][]bool) string {
	var content strings.Builder = strings.Builder{}

	for i := 0; i < len(surfaces); i++ {
		for j := 0; j < len(surfaces[i]); j++ {
			if surfaces[i][j] {
				content.WriteByte(byte('*'))
			} else {
				content.WriteByte(byte('.'))
			}
		}
		content.WriteString("\n")
	}

	return content.String()
}

func main() {
	surfaces, beacons := readImage()
	content := generateMap(surfaces)

	if printSolution {
		fmt.Print(content)
	} else {
		err := os.WriteFile(filename, []byte(content), 0644)
		if err != nil {
			log.Fatal(err)
		}
	}
	fmt.Println("Beacons placed: ", beacons)
	fmt.Println("Done!")
}

func init() {
	if len(os.Args) != 4 && len(os.Args) != 5 {
		log.Fatal("Usage: ./map_generator [size rows:cols] [image_file.png] [invert option t/f] <output_file_name>")
	}

	imageFile = os.Args[2]
	if _, err := os.Stat(imageFile); err != nil {
		log.Fatal(err)
	}

	fmt.Sscanf(os.Args[1], "%d:%d", &rows, &cols)

	if rows < 1 || cols < 1 || rows*cols < 2 {
		log.Fatal("Rows and cols must be greater than 1")
	}

	if os.Args[3] != "t" && os.Args[3] != "f" {
		log.Fatal("Invert option must be t (for true) or f (for false)")
	}

	inverted = os.Args[3] == "t"

	if len(os.Args) == 4 {
		printSolution = true
	} else {
		filename = os.Args[4]
	}
}

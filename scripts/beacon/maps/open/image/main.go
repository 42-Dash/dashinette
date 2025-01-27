package main

import (
	"fmt"
	"image/png"
	"log"
	"math"
	"math/rand"
	"os"
	"strings"
)

var (
	rows, cols        int
	beacons           int
	inverted          bool
	imageFile         string
	printSolution     bool
	filename_template string
)

func readImage() [][]uint8 {
	ans := [][]uint8{}

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
		line := []uint8{}
		for j := 0; j < cols; j++ {
			r, g, b, _ := img.At(j*width/cols, i*heights/rows).RGBA()
			r, g, b = r/257, g/257, b/257
			rg := float64(r+g+b) / 96.0
			if inverted {
				line = append(line, uint8(math.Round(rg)))
			} else {
				line = append(line, 8-uint8(math.Round(rg)))
			}
		}
		ans = append(ans, line)
	}

	return ans
}

func generateMaps(surfaces [][]uint8) []string {
	offsets := map[int][2]int{
		0: {0, 0},
		1: {rows / 2, 0},
		2: {0, cols / 2},
		3: {rows / 2, cols / 2},
	}

	var contents [4]strings.Builder = [4]strings.Builder{}

	for iteration := 0; iteration < 4; iteration++ {
		for row := 0; row < len(surfaces)/2; row++ {
			for col := 0; col < len(surfaces[row])/2; col++ {
				curr := surfaces[row+offsets[iteration][0]][col+offsets[iteration][1]]
				// 42 is the answer to life, the universe and everything
				if curr == 42 {
					contents[iteration].WriteByte(byte('*')) // universe
				} else {
					contents[iteration].WriteByte(byte('1' + curr))
				}
			}
			contents[iteration].WriteString("\n")
		}
	}

	return []string{
		contents[0].String(),
		contents[1].String(),
		contents[2].String(),
		contents[3].String(),
	}
}

func printDistribution(surfaces [][]uint8) {
	distribution := [9]int{}
	beacons := [4]int{}

	for i := 0; i < len(surfaces); i++ {
		for j := 0; j < len(surfaces[i]); j++ {
			if surfaces[i][j] == 42 {
				beacons[i/(rows/2)*2+j/(cols/2)]++
			} else {
				distribution[surfaces[i][j]]++
			}
		}
	}

	var content strings.Builder = strings.Builder{}
	for i := 0; i < len(distribution); i++ {
		content.WriteString(fmt.Sprintf("%d", distribution[i]))
		if i != len(distribution)-1 {
			content.WriteString(" : ")
		}
	}

	fmt.Println(content.String())
	// Such a stupid way of doing this, but it's the only way
	sum := beacons[0] + beacons[1] + beacons[2] + beacons[3]
	fmt.Println("Beacons: ", sum, "/", rows*cols, beacons)
}

func placeBeacons(surfaces [][]uint8) {
	randCol, randRow := 0, 0
	i := 0

	for i < beacons {
		randCol, randRow = rand.Intn(cols), rand.Intn(rows)
		if surfaces[randRow][randCol] != 42 {
			surfaces[randRow][randCol] = 42
			i++
		}
	}
}

func printSolutions(content []string) {
	for i := 0; i < 4; i++ {
		fmt.Print(content[i])
		fmt.Println()
	}
}

func storeSolutions(grids []string) {
	for i := 0; i < 4; i++ {
		filename := fmt.Sprintf("%s_%d.txt", filename_template, i)
		if err := os.WriteFile(filename, []byte(grids[i]), 0644); err != nil {
			log.Fatal(err)
		}
	}
}

func main() {
	surfaces := readImage()
	placeBeacons(surfaces)
	content := generateMaps(surfaces)

	if printSolution {
		printSolutions(content)
	} else {
		storeSolutions(content)
	}
	printDistribution(surfaces)
}

func init() {
	if len(os.Args) != 5 && len(os.Args) != 6 {
		log.Fatal("Usage: ./map_generator [size rows:cols] [beacons number] [image_file.png] [invert option t/f] <output_file_name (no extension)>")
	}

	fmt.Sscanf(os.Args[1], "%d:%d", &rows, &cols)

	imageFile = os.Args[3]
	if _, err := os.Stat(imageFile); err != nil {
		log.Fatal(err)
	}

	fmt.Sscanf(os.Args[2], "%d", &beacons)
	if beacons < 1 {
		log.Fatal("Beacons number must be greater than 0")
	}
	if beacons >= rows*cols {
		log.Fatal("Beacons number must be less than the number of cells")
	}

	if rows < 1 || cols < 1 || rows*cols < 2 {
		log.Fatal("Rows and cols must be greater than 1")
	}
	if rows%2 != 0 || cols%2 != 0 {
		log.Fatal("Rows and cols must be even (multiple of 2)")
	}

	if os.Args[4] != "t" && os.Args[4] != "f" {
		log.Fatal("Invert option must be t (for true) or f (for false)")
	}
	inverted = os.Args[4] == "t"

	if len(os.Args) == 5 {
		printSolution = true
	} else {
		filename_template = os.Args[5]
	}
}

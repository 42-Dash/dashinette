package common

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

const (
	// valid runes for the path
	VALID_RUNES_OPEN_LEAGUE   = "012345UDLR\n"
	VALID_RUNES_ROOKIE_LEAGUE = "UDLR\n"
)

// returns player position
func PlayersPosition(input []string) (int, int) {
	for idx, line := range input {
		if strings.Contains(line, "M") {
			return idx, strings.IndexRune(line, 'M')
		}
	}
	return -1, -1
}

// returns the last valid answer from the output.
// the last valid answer ends with the last newline rune in the string.
// It consists of valid_runes only.
func ExtractLastAnswer(output string, valid_runes string) (string, error) {
	for _, c := range output {
		if !strings.ContainsRune(valid_runes, c) {
			return "", fmt.Errorf("error: invalid character in path")
		}
	}

	end := strings.LastIndex(output, "\n")
	if end == -1 {
		return "", fmt.Errorf("error: no new line found")
	}

	var path string
	begin := strings.LastIndex(output[:end], "\n")

	if begin == -1 {
		path = output[:end]
	} else {
		path = output[begin+1 : end]
	}

	if len(path) == 0 {
		return "", fmt.Errorf("error: empty line")
	}
	return path, nil
}

// executes the given file with the given input and timeout.
func ExecuteWithTimeout(filename string, input []string, timeout int) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, filename, input...)

	// Capture stdout
	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	// Start the command
	if err := cmd.Start(); err != nil {
		return "", fmt.Errorf("error: failed to start: %v", err)
	}

	// Wait for the command to complete or be killed after n seconds
	if err := cmd.Wait(); err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return stdout.String(), nil
		} else {
			return "", fmt.Errorf("error: unexpected behavior")
		}
	}

	return stdout.String(), nil
}

package parser

import (
	"fmt"
	"path/filepath"
	"strings"
)

// Returns the path to the repository of the given team.
func GetRepoPath(name, dashFolder string) string {
	return fmt.Sprintf(dashFolder+"repos/%s", name)
}

// Returns the path to the traces file of the given team.
func GetTracesPath(name, dashFolder string) string {
	return fmt.Sprintf(dashFolder+"traces/%s.json", name)
}

func GetRepoPathContainerized(path, dashFolder string) string {
	return strings.Replace(
		filepath.ToSlash(path),
		dashFolder+"repos/",
		"repo/",
		1,
	)
}

func GetTracesPathContainerized(name string) string {
	return fmt.Sprintf("traces/%s.json", name)
}

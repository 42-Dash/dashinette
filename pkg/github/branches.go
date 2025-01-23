package github

import (
	"fmt"
)

// Checks if a branch exists in the repository.
func isBranchExist(repoPath string, branch string) bool {
	err := executeCommand(
		repoPath,
		"git",
		"show-ref",
		"--verify",
		"--quiet",
		fmt.Sprintf("refs/heads/%s", branch),
	)
	return err == nil
}

// Creates a branch in the repository.
func SwitchBranch(repoPath string, branch string) (err error) {
	if isBranchExist(repoPath, branch) {
		return executeCommand(repoPath, "git", "switch", branch)
	}

	err = executeCommand(repoPath, "git", "checkout", "-b", branch)
	if err != nil {
		return fmt.Errorf("failed to create branch: %w", err)
	}

	err = executeCommand(repoPath, "git", "push", "-f", "origin", branch)
	if err != nil {
		return fmt.Errorf("failed to push branch: %w", err)
	}
	return nil
}

// Creates an empty branch in the repository.
func SwitchEmptyBranch(repoPath string, branch string) (err error) {
	if isBranchExist(repoPath, branch) {
		if err = executeCommand(repoPath, "git", "switch", branch); err != nil {
			return fmt.Errorf("failed to switch branch: %w", err)
		}
	} else {
		if err = executeCommand(repoPath, "git", "checkout", "--orphan", branch); err != nil {
			return fmt.Errorf("failed to create branch: %w", err)
		}
	}

	executeCommand(repoPath, "git", "rm", "-rf", ".")
	return nil
}

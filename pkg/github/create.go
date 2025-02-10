package github

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// Returns the URL to create a new repository in the organization.
func createRepoUrl() string {
	return fmt.Sprintf(
		"https://api.github.com/orgs/%s/repos",
		os.Getenv("GITHUB_ORGANISATION"),
	)
}

func initialCommitUrl(repo_name string) string {
	return fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/README.md",
		os.Getenv("GITHUB_ORGANISATION"),
		repo_name,
	)
}

func createRepoFromTemplateUrl(template string) string {
	return fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/generate",
		os.Getenv("GITHUB_ORGANISATION"),
		template,
	)
}

// Returns an error message based on the status code.
func createRepoErrorMessage(statusCode int) string {
	switch statusCode {
	case http.StatusForbidden:
		return "forbidden"
	case http.StatusUnprocessableEntity:
		return "repository already exists"
	default:
		return fmt.Sprintf("unexpected status code %d", statusCode)
	}
}

// initializes the repository creation process with a commit
func initialCommit(repo_name string) error {
	payload, _ := json.Marshal(map[string]interface{}{
		"message": "Initial commit",
		"content": base64.StdEncoding.EncodeToString([]byte("")),
		"branch":  "main",
	})

	url := initialCommitUrl(repo_name)
	res, err := sendRequest(http.MethodPut, url, payload)
	if err != nil {
		return fmt.Errorf("cannot create initial commit: %s", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("cannot create initial commit: %s", err)
	}

	return nil
}

// CreateRepo creates a new repository in the organization.
//
// Parameters:
//   - name: The name of the repository.
//   - isPrivate: A boolean indicating whether the repository should be private.
//
// Returns:
//   - error: An error object if an error occurred, otherwise nil.
func CreateRepo(name string, isPrivate bool) error {
	payload, err := json.Marshal(map[string]interface{}{
		"name":    name,
		"private": isPrivate,
	})
	if err != nil {
		return err
	}

	var url string = createRepoUrl()
	res, err := sendRequest(http.MethodPost, url, payload)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("cannot create repository %s: %s",
			name,
			createRepoErrorMessage(res.StatusCode),
		)
	}

	err = initialCommit(name)
	if err != nil {
		return err
	}

	return nil
}

func CreateRepoFromTemplate(name string, template string, isPrivate bool) error {
	payload, err := json.Marshal(map[string]interface{}{
		"owner":                os.Getenv("GITHUB_ORGANISATION"),
		"name":                 name,
		"description":          "Template repository for the Dash project",
		"include_all_branches": false,
		"private":              isPrivate,
	})
	if err != nil {
		return err
	}

	var url string = createRepoFromTemplateUrl(template)
	res, err := sendRequest(http.MethodPost, url, payload)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusCreated {
		return fmt.Errorf("cannot create repository %s: %s",
			name,
			createRepoErrorMessage(res.StatusCode),
		)
	}

	return nil
}

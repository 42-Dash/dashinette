package containerization

import (
	"archive/tar"
	"bytes"
	"context"
	"dashinette/internals/traces"
	"dashinette/pkg/parser"
	"fmt"
	"os"
	"path/filepath"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

// creates a new docker client.
func setupDockerClient() (cli *client.Client, err error) {
	cli, err = client.NewClientWithOpts(
		client.FromEnv, client.WithAPIVersionNegotiation(),
	)
	return cli, err
}

// launches a new container which runs the tester for the given team.
func launchContainer(ctx context.Context, client *client.Client, team parser.Team, repo, tracesfile string) (string, error) {
	dir, _ := os.Getwd()
	config := parser.SerializeTesterConfig(team, repo, tracesfile)
	containerConfig := &container.Config{
		Image:      os.Getenv("DOCKER_IMAGE_NAME"),
		Cmd:        []string{"sh", "-c", fmt.Sprintf("./tester '%v'", config)},
		WorkingDir: "/app",
	}
	hostConfig := &container.HostConfig{
		Binds:      []string{fmt.Sprintf("%s/%s/traces:/app/traces", dir, traces.DashFolder)},
		AutoRemove: false,
	}

	resp, err := client.ContainerCreate(ctx, containerConfig, hostConfig, nil, nil, "")
	if err != nil {
		return "", err
	}

	err = copyToContainer(ctx, client, resp.ID, repo, "/app")
	if err != nil {
		return "", err
	}

	// start the container
	if err := client.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return "", err
	}

	return resp.ID, nil
}

// waits for the container to finish and returns the logs.
func waitForContainer(ctx context.Context, client *client.Client, containerID string) (string, error) {
	statusCh, errCh := client.ContainerWait(ctx, containerID, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		if err != nil {
			return "", err
		}
	case <-statusCh:
	}

	output, err := client.ContainerLogs(ctx, containerID, container.LogsOptions{ShowStdout: false, ShowStderr: true})
	if err != nil {
		return "", err
	}

	stdout, stderr := new(bytes.Buffer), new(bytes.Buffer)
	_, err = stdcopy.StdCopy(stdout, stderr, output)
	if err != nil {
		return "", err
	}

	if stderr.Len() > 0 {
		return "", fmt.Errorf("stderr: %s", stderr.String())
	}

	return stdout.String(), nil
}

// inspects the container and returns the exit code.
func inspectContainerExitCode(ctx context.Context, client *client.Client, containerID string) (int, error) {
	inspect, err := client.ContainerInspect(ctx, containerID)
	if err != nil {
		return 0, err
	}
	return inspect.State.ExitCode, nil
}

// runs the docker container for the given team and returns the logs.
func runContainerized(team parser.Team, repo string, tracesfile string) (string, error) {
	ctx := context.Background()

	client, err := setupDockerClient()
	if err != nil {
		return "", err
	}

	containerID, err := launchContainer(ctx, client, team, repo, tracesfile)
	if err != nil {
		return "", err
	}

	logs, err := waitForContainer(ctx, client, containerID)
	if err != nil {
		return "", err
	}

	exitCode, err := inspectContainerExitCode(ctx, client, containerID)
	if err != nil {
		return "", err
	}
	if exitCode != 0 {
		return "", fmt.Errorf("container exited with code %d", exitCode)
	}

	if err := client.ContainerRemove(ctx, containerID, container.RemoveOptions{}); err != nil {
		return "", err
	}

	return logs, nil
}

// grades the assignment for the given team.
// the function returns an error if an error occurred, otherwise nil.
// the function creates a log file with the results of the grading.
func GradeAssignmentInContainer(team parser.Team, repo string, filename string) error {
	// delete file if it exists
	if _, err := os.Stat(filename); err == nil {
		if err := os.Remove(filename); err != nil {
			return fmt.Errorf("failed to delete file: %v", err)
		}
	}

	logs, err := runContainerized(team, repo, filename)
	if err != nil {
		return fmt.Errorf("failed to run docker container: %v", err)
	}

	if _, err := os.Stat(filename); err == os.ErrNotExist {
		return fmt.Errorf("cannot create log file")
	}

	fmt.Println(logs)
	return err
}

// copyToContainer copies the files from the srcPath to the destPath in the container.
//
// Parameters:
//   - ctx: The context of the operation.
//   - cli: The docker client.
//   - containerID: The ID of the container.
//   - srcPath: The path of the files to copy.
//   - destPath: The path to copy the files to.
func copyToContainer(ctx context.Context, cli *client.Client, containerID, srcPath, destPath string) error {
	buf := new(bytes.Buffer)
	tw := tar.NewWriter(buf)

	err := filepath.Walk(srcPath, func(file string, fi os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if fi.Mode().IsRegular() {
			data, err := os.ReadFile(file)
			if err != nil {
				return err
			}

			header := &tar.Header{
				Name:    traces.GetRepoPathContainerized(file),
				Mode:    int64(fi.Mode().Perm()),
				Size:    fi.Size(),
				ModTime: fi.ModTime(),
			}
			if err := tw.WriteHeader(header); err != nil {
				return err
			}
			if _, err := tw.Write(data); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return err
	}

	if err := tw.Close(); err != nil {
		return err
	}

	return cli.CopyToContainer(ctx, containerID, destPath, buf, container.CopyToContainerOptions{})
}

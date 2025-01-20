package rookie

import (
	"os"
	"os/exec"
	"testing"
)

var VALID_TEST_MAP_ROOKIE_LEAGUE = []string{"M9G", "141", "111"}

const (
	// Test programs for rookieleague
	ROOKIELEAGUE_NEW_LINE      = "/rookieleague/invalidnewline"
	ROOKIELEAGUE_TIMEOUT       = "/rookieleague/invalidtimeout"
	ROOKIELEAGUE_RUNES         = "/rookieleague/invalidrunes"
	ROOKIELEAGUE_PATH          = "/rookieleague/invalidpath"
	ROOKIELEAGUE_VALID_TIMEOUT = "/rookieleague/validtimeout"
	ROOKIELEAGUE_TEST          = "/rookieleague/validtest"
)

var tests = []string{
	ROOKIELEAGUE_NEW_LINE,
	ROOKIELEAGUE_TIMEOUT,
	ROOKIELEAGUE_RUNES,
	ROOKIELEAGUE_PATH,
	ROOKIELEAGUE_VALID_TIMEOUT,
	ROOKIELEAGUE_TEST,
}

// Constants for the tests
const (
	CMD                     = "../../../cmd/marvin/tests/"
	ROOKIE_LEAGUE_VALID_MAP = CMD + "rookieleague/4x4.txt"
	BIN                     = "../../../bin/"
	TIMEOUT                 = 3 // seconds
)

func cleanUp() {
	os.RemoveAll(BIN)
}

func TestMain(m *testing.M) {
	// Compile the executables
	for _, test := range tests {
		err := exec.Command("go", "build", "-o", BIN+test, CMD+test).Run()
		if err != nil {
			cleanUp()
			os.Exit(1)
		}
	}
	defer cleanUp()

	code := m.Run()
	os.Exit(code)
}

func TestGradeRookieLeagueAssignment_RL_MissedNewLine(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_NEW_LINE,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeRookieLeagueAssignment_RL_InvalidTimeout(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_TIMEOUT,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeRookieLeagueAssignment_RL_InvalidRunes(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_RUNES,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeRookieLeagueAssignment_RL_InvalidPath(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_PATH,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeRookieLeagueAssignment_RL_ValidTimeout(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_VALID_TIMEOUT,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 8 && err == nil) {
		t.Errorf("Error: expected no error and grade, got error=%v and grade=%v", err, output)
	}
}

func TestGradeRookieLeagueAssignment_RL_ValidTest(t *testing.T) {
	_, output, err := GradeRookieLeagueAssignment(
		BIN+ROOKIELEAGUE_TEST,
		ROOKIE_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 8 && err == nil) {
		t.Errorf("Error: expected no error and grade, got error=%v and grade=%v", err, output)
	}
}

func TestGetScoreRookieLeague_EmptyPath(t *testing.T) {
	path := ""
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_InvalidPath(t *testing.T) {
	path := "DURL"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_OutOfBounds(t *testing.T) {
	path := "U"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_MarvinDidntReachGoal(t *testing.T) {
	path := "R"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_ValidPath(t *testing.T) {
	path := "DRRU"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 6 && err == nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_InvalidRuneNewLine(t *testing.T) {
	path := "DRRU\n"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreRookieLeague_InvalidRune(t *testing.T) {
	path := "DRRUW"
	input := VALID_TEST_MAP_ROOKIE_LEAGUE
	score, err := getScoreRookieLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

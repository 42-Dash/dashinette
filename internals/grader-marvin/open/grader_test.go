package open

import (
	"os"
	"os/exec"
	"testing"
)

var VALID_TEST_MAP_OPEN_LEAGUE = []string{"W4A2E3", "MME5GG", "W7E8A9"}

const (
	// Test programs for openleague
	OPENLEAGUE_MISSED_CHARACTER = "/openleague/invalidmissedcharacter"
	OPENLEAGUE_UNDERFLOW        = "/openleague/invalidunderflow"
	OPENLEAGUE_EXCEEDS_MAP      = "/openleague/invalidexceed"
	OPENLEAGUE_OVERFLOW         = "/openleague/invalidoverflow"
	OPENLEAGUE_NEW_LINE         = "/openleague/invalidnewline"
	OPENLEAGUE_TIMEOUT          = "/openleague/invalidtimeout"
	OPENLEAGUE_RUNES            = "/openleague/invalidrunes"
	OPENLEAGUE_PATH             = "/openleague/invalidpath"
	OPENLEAGUE_NOT_LAST_PATH    = "/openleague/validnotlast"
	OPENLEAGUE_VALID_TIMEOUT    = "/openleague/validtimeout"
	OPENLEAGUE_TEST             = "/openleague/validtest"
)

// slices with values for the tests
var tests = []string{
	OPENLEAGUE_MISSED_CHARACTER,
	OPENLEAGUE_UNDERFLOW,
	OPENLEAGUE_EXCEEDS_MAP,
	OPENLEAGUE_OVERFLOW,
	OPENLEAGUE_NEW_LINE,
	OPENLEAGUE_TIMEOUT,
	OPENLEAGUE_RUNES,
	OPENLEAGUE_PATH,
	OPENLEAGUE_NOT_LAST_PATH,
	OPENLEAGUE_VALID_TIMEOUT,
	OPENLEAGUE_TEST,
}

// Constants for the tests
const (
	CMD                   = "../../../cmd/marvin/tests/"
	OPEN_LEAGUE_VALID_MAP = CMD + "openleague/4x4.txt"
	BIN                   = "../../../bin/"
	TIMEOUT               = 3 // seconds
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

func TestGradeOpenLeagueAssignment_OL_MissedCharacter(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_MISSED_CHARACTER,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_Underflow(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_UNDERFLOW,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_ExceedsMap(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_EXCEEDS_MAP,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_Overflow(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_OVERFLOW,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_MissedNewLine(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_NEW_LINE,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_InvalidTimeout(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_TIMEOUT,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_InvalidRunes(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_RUNES,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_InvalidPath(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_PATH,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 0 && err != nil) {
		t.Errorf("Error: expected output=0 and error, got %v, %v", output, err)
	}
}

func TestGradeOpenLeagueAssignment_OL_NotLastPath(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_NOT_LAST_PATH,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 26 && err == nil) {
		t.Errorf("Error: expected no error and grade, got error=%v and grade=%v", err, output)
	}
}

func TestGradeOpenLeagueAssignment_OL_ValidTimeout(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_VALID_TIMEOUT,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 26 && err == nil) {
		t.Errorf("Error: expected no error and grade, got error=%v and grade=%v", err, output)
	}
}

func TestGradeOpenLeagueAssignment_OL_ValidTest(t *testing.T) {
	_, output, err := GradeOpenLeagueAssignment(
		BIN+OPENLEAGUE_TEST,
		OPEN_LEAGUE_VALID_MAP,
		TIMEOUT)
	if !(output == 26 && err == nil) {
		t.Errorf("Error: expected no error and grade, got error=%v and grade=%v", err, output)
	}
}

func TestGetScoreOpenLeague_MissingCharacterPoints(t *testing.T) {
	path := "URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_CharacterPointsSumMismatchSmaller(t *testing.T) {
	path := "333URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_CharacterPointsSumMismatchGreater(t *testing.T) {
	path := "344URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_CharacterPointsGreaterThanFive(t *testing.T) {
	path := "361URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_CharacterPointsLessThanTwo(t *testing.T) {
	path := "35URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_InvalidPath(t *testing.T) {
	path := "334URR"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_ValidPath(t *testing.T) {
	path := "154URRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 37 && err == nil) {
		t.Errorf("Error: invalid score %v", score)
	}
}

func TestGetScoreOpenLeague_EmpyPath(t *testing.T) {
	path := ""
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_ExceedingBoundsRight(t *testing.T) {
	path := "334URRDR"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_ExceedingBoundsLeft(t *testing.T) {
	path := "334LLRRURRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_ExceedingBoundsUp(t *testing.T) {
	path := "334UUUDDRRD"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_ExceedingBoundsDown(t *testing.T) {
	path := "334DDURRU"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

func TestGetScoreOpenLeague_InvalidRune(t *testing.T) {
	path := "334DDURRUP"
	input := VALID_TEST_MAP_OPEN_LEAGUE
	score, err := getScoreOpenLeague(path, input)
	if !(score == 0 && err != nil) {
		t.Errorf("Error: %v", err)
	}
}

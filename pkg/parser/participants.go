package parser

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
)

// Team represents a team of participants.
type Team struct {
	Name      string   `json:"name"`
	Nicknames []string `json:"members"`
	League    string   `json:"league"`
}

// The team name can only contain:
//   - ASCII letters
//   - digits
//   - characters '.' '-' and '_'
func (t *Team) ValidateTeamMember() error {
	re := regexp.MustCompile(`^[a-zA-Z0-9\.\-_]+$`)

	if !re.MatchString(t.Name) {
		return fmt.Errorf("invalid team name: %s", t.Name)
	}

	if len(t.Nicknames) == 0 {
		return fmt.Errorf("empty team: %s", t.Name)
	}

	for _, nickname := range t.Nicknames {
		if !re.MatchString(nickname) {
			return fmt.Errorf("invalid nickname: %s", nickname)
		}
	}

	return nil
}

// Participants represents a list of teams.
// Contains the entire content of the participants.json file.
type Participants struct {
	Teams []Team `json:"teams"`
}

// Checks if the team names and nicknames are unique.
func (p *Participants) validateTeams() error {
	if len(p.Teams) == 0 {
		return fmt.Errorf("no teams found")
	}

	for _, team := range p.Teams {
		if err := team.ValidateTeamMember(); err != nil {
			return err
		}
	}

	teams := make(map[string]bool)
	nicknames := make(map[string]bool)
	for _, team := range p.Teams {
		if teams[team.Name] {
			return fmt.Errorf("duplicate team name: %s", team.Name)
		}
		teams[team.Name] = true
		for _, nickname := range team.Nicknames {
			if nicknames[nickname] {
				return fmt.Errorf("duplicate nickname: %s in team %v", nickname, team.Name)
			}
			nicknames[nickname] = true
		}
	}
	return nil
}

// Loads the participants from the given file.
//
// Parameters:
//   - filename: The name of the file to load the participants from.
//
// Returns:
//   - Participants: The participants object.
//   - error: An error object if an error occurred, otherwise nil.
func LoadParticipantsJSON(participantsFile string) (Participants, error) {
	participants := Participants{}
	file, err := os.Open(participantsFile)
	if err != nil {
		return Participants{}, err
	}
	defer file.Close()

	err = json.NewDecoder(file).Decode(&participants)
	if err != nil {
		return Participants{}, err
	}

	if err := participants.validateTeams(); err != nil {
		return Participants{}, err
	}

	return participants, nil
}

package grader

import (
	"dashinette/pkg/constants/beacon"
	"dashinette/pkg/parser"
	"encoding/json"
	"os"
)

// MapConfig represents the configuration for a single map.
type MapConfig struct {
	Paths   []string `json:"paths"`
	Name    string   `json:"name"`
	Beacons string   `json:"beacons"`
	Timeout int      `json:"timeout"`
}

type LeagueConfig struct {
	RookieLeague []MapConfig `json:"rookieleague"`
	OpenLeague   []MapConfig `json:"openleague"`
}

// TesterConfig represents the configuration for the tester.
type TesterConfig struct {
	MapsJSON LeagueConfig
	Args     parser.TesterArgs
}

// DeserializeLeagueConfig deserializes JSON data into a TesterConfig struct.
func DeserializeConfig(data []byte) (TesterConfig, error) {
	var args parser.TesterArgs
	if err := json.Unmarshal(data, &args); err != nil {
		return TesterConfig{}, err
	}

	var config LeagueConfig
	file, err := os.ReadFile(beacon.MAPS_CONFIG_FILE)
	if err != nil {
		return TesterConfig{}, err
	}

	if err := json.Unmarshal(file, &config); err != nil {
		return TesterConfig{}, err
	}

	return TesterConfig{
		MapsJSON: config,
		Args:     args,
	}, nil
}

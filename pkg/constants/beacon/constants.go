package beacon

const (
	DASH_FOLDER     = "dashes/beacon/"
	EXECUTABLE_NAME = "beacon"
	SUBJECT_PATH    = DASH_FOLDER + "README.md"

	TEMPLATE_REPO     = "template-beacon"
	DOCKER_IMAGE_NAME = "beacon-tester"

	DOTENV_PATH              = "config/.env"
	MAPS_CONFIG_FILE         = "config/maps.json"
	PARTICIPANTS_CONFIG_FILE = "config/participants.json"
	DOCKERFILE_NAME          = "Dockerfile.beacon"
)

var REQUIRED_ENVS []string = []string{
	"GITHUB_ACCESS",
	"GITHUB_ORGANISATION",
}

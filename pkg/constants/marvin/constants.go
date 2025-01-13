package marvin

const (
	DASH_FOLDER     = "dashes/marvin/"
	EXECUTABLE_NAME = "marvin"
	SUBJECT_PATH    = DASH_FOLDER + "README.md"

	TEMPLATE_REPO     = "template-marvin"
	DOCKER_IMAGE_NAME = "marvin-tester"

	DOTENV_PATH              = "config/.env"
	MAPS_CONFIG_FILE         = "config/maps.json"
	PARTICIPANTS_CONFIG_FILE = "config/participants.json"
	DOCKERFILE_NAME          = "Dockerfile.marvin"
)

var REQUIRED_ENVS []string = []string{
	"GITHUB_ACCESS",
	"GITHUB_ORGANISATION",
}

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

const HEADER_TEMPLATE = `+---------------------------------------------+
|    __  __                  _                |
|    |  \/  |                (_)              |
|    | \  / | __ _ _ ____   ___ _ __          |
|    | |\/| |/ _` + "`" + ` | '__\ \ / / | '_ \         |
|    | |  | | (_| | |   \ V /| | | | |        |
|    |_|  |_|\__,_|_|    \_/ |_|_| |_|        |
+---------------------------------------------+
|    Welcome to the Marvin Dash CLI           |
+---------------------------------------------+
`

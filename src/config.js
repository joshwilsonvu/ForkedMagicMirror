import path from "path";
import userConfig from "./userconfig/config";
import utils from "./utils";
import defaults from "./defaults";

// Warn about deprecated options
const deprecatedOptions = ["kioskmode"];
let usedDeprecated = deprecatedOptions.filter(o => userConfig.hasOwnProperty(o));
if (usedDeprecated.length > 0) {
    console.warn(utils.colors.warn(
        "WARNING! Your config is using deprecated options: " +
        usedDeprecated.join(", ") +
        ". Check README and CHANGELOG for more up-to-date ways of getting the same functionality.")
    );
}

// replace global env configuration
const env = {
    root_path: path.resolve(__dirname + "/../"),
    mmPort: process.env.MM_PORT,
    configuration_file: process.env.MM_CONFIG_FILE,
};

// Join the user-provided configuration with the defaults
const config = {...defaults, ...env, ...userConfig};
export default config;


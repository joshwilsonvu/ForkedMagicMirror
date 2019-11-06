import fs from "fs";
import path from "path";
//import Server from "./server";
import util from "./utils";
import defaultModules from "./modules/default/defaultmodules";
import config from "./config";

// The next part is here to prevent a major exception when there
// is no internet connection. This could probable be solved better.
process.on("uncaughtException", err => {
  console.log("Whoops! There was an uncaught exception...");
  console.error(err);
  console.log("MagicMirror will not quit, but it might be a good idea to check why this happened. Maybe no internet connection?");
  console.log("If you think this really is an issue, please open an issue on GitHub: https://github.com/MichMich/MagicMirror/issues");
});

const tryImport = async (path, onFail) => {
  try {
	return await import(path);
  } catch (e) {
	if (onFail) {
	  return onFail(e);
	}
  }
};

class App {
  constructor() {
	this.nodeHelpers = [];
  }

  /* loadModule(module)
   * Loads a specific module.
   *
   * argument module string - The name of the module (including subpath).
   */
  async loadModule(module) {
	const elements = module.split("/");
	const moduleName = elements[elements.length - 1];
	let moduleFolder = path.join(__dirname, "..", "modules", module);

	if (defaultModules.indexOf(moduleName) !== -1) {
	  moduleFolder = path.join(__dirname, "..", "modules", "default", module);
	}

	const helperPath = path.join(moduleFolder, "node_helper");

	const Module = await tryImport(helperPath, err => {
	  console.log(`No helper found for module: ${moduleName}.`);
	});
	if (Module) {
	  const m = new Module();
	  if (m.requiresVersion) {
		console.log(`Check MagicMirror version for node helper '${moduleName}' - Minimum version: ${m.requiresVersion} - Current version: ${config.version}`);
		if (cmpVersions(config.version, m.requiresVersion) >= 0) {
		  console.log("Version is ok!");
		} else {
		  console.log(`Version is incorrect. Skip module: '${moduleName}'`);
		  return;
		}
	  }

	  m.setName(moduleName);
	  m.setPath(path.resolve(moduleFolder));
	  this.nodeHelpers.push(m);

	  return new Promise(res => m.loaded(res));
	}
  }

  async loadModules(modules) {
	await Promise.all(modules.map(m => this.loadModule(m)));
	console.log("All module helpers loaded.");
  }
}

/* cmpVersions(a,b)
	 * Compare two semantic version numbers and return the difference.
	 *
	 * argument a string - Version number a.
	 * argument a string - Version number b.
	 */
function cmpVersions(a, b) {
  const regExStrip0 = /(\.0+)+$/;
  const segmentsA = a.replace(regExStrip0, "").split(".");
  const segmentsB = b.replace(regExStrip0, "").split(".");
  const l = Math.min(segmentsA.length, segmentsB.length);

  for (let i = 0; i < l; i++) {
	const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
	if (diff) {
	  return diff;
	}
  }
  return segmentsA.length - segmentsB.length;
}

export default new App();
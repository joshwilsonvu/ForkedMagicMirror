import codegen from "codegen.macro";
import config from "../shared/config";

/*
 * At compile time, matches all of the js files in the modules directory
 * that have the same names as their enclosing folder, the convention for
 * MagicMirror modules. This becomes the list of available modules to load
 */
let dirs;
codegen`
  const glob = require("glob");
  const path = require("path");
  const fs = require("fs");
  const config = require("esm")(module)("../shared/config").default;
  
  const files = glob.sync("**/*.[jt]s?(x)", { 
    cwd: path.join(__dirname, "modules"), 
    ignore: "node_modules/**" 
  }).filter(p => {
    let match = /\\/(.+)\\/(.+)\\.[jt]sx?$/.exec(p)
    return Boolean(match) && match[1] === match[2] && config.modules.some(m => m.module === match[1]);
  });
  
  const isReact = m => m.match(/^import.*['"\`]react['"\`]/);
  module.exports = files
    .map(f => fs.readFileSync(path.resolve("./modules", f)))
    .map(m => isReact(m) ? "import '" +  m.replace(/\\.[jt]sx?$/, '') + "'" : "require(" + m.replace(/\\.[jt]sx?$/, '') + ")")
    .join("\\n");
  console.log(JSON.stringify(module.exports));
`;



export default dirs;


import codegen from "codegen.macro";
import Module from "module";

/*
 * At compile time, matches all of the js files in the modules directory
 * that have the same names as their enclosing folder, the convention for
 * MagicMirror modules. This becomes the list of available modules to load
 */

const compatEval = js => {
  return (new Function(js))(Module);
};

codegen`
  const glob = require("glob");
  const path = require("path");
  const fs = require("fs");
  const esm = require("esm");
  const config = esm(module)("../shared/config").default;
  
  const files = glob.sync("**/*.[jt]s?(x)", { 
    cwd: path.join(__dirname, "modules"), 
    ignore: "node_modules/**" 
  }).filter(p => {
    let match = /\\/(.+)\\/(.+)\\.[jt]sx?$/.exec(p)
    return Boolean(match) && match[1] === match[2] && config.modules.some(m => m.module === match[1]);
  });
  
  const isReact = m => /^import.*['"\`]react['"\`]/.test(m);
  module.exports = files
    .map(f => [f, fs.readFileSync(path.resolve("./modules", f), "utf8")])
    .map(([f, m]) => isReact(m) ? "import './modules/" +  f.replace(/\\.[jt]sx?$/, '') + "'" : "require('./modules/" + f.replace(/\\.[jt]sx?$/, '') + "')")
    .join("\\n");
  console.log(JSON.stringify(module.exports));
`;



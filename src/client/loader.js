import codegen from "codegen.macro";
import Module from "./module";

/*
 * At compile time, matches all of the js files in the modules directory
 * that have the same names as their enclosing folder, the convention for
 * MagicMirror modules. This becomes the list of available modules to load
 */

const compatImport = js => {
  return (new Function(js))(Module);
};


codegen`
  const glob = require("glob");
  const node_path = require("path");
  const fs = require("fs");
  const esm = require("esm");
  const config = esm(module)("../shared/config").default;
  
  const paths = glob.sync("**/*.[jt]s?(x)", { 
    cwd: node_path.join(__dirname, "modules"), 
    ignore: "node_modules/**" 
  }).map(path => {
    let match = /\\/(.+)\\/(.+)\\.[jt]sx?$/.exec(path);
    return (match && match[1] === match[2]) ? [path, match[1]] : [];
  }).filter(([path, name]) => {
    return name && config.modules.some(m => m.module === name);
  });
  const isReact = contents => /^import.*['"\`]react['"\`]/.test(contents);

  module.exports = paths
    .map(([path, name]) => [path, name, fs.readFileSync(node_path.resolve("./modules", f), "utf8")])
    .map(([path, name, contents]) => isReact(contents) ? "import './modules/" +  name + "'" : "compatImport('./modules/" + name + "')")
    .join("\\n");
  console.log(JSON.stringify(module.exports));
`;



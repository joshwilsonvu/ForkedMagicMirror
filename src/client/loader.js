import React from "react";
import codegen from "codegen.macro";
import Module from "./legacy/module";

/*
 * At compile time, match all of the js files in the modules directory
 * that have the same names as their enclosing folder, the convention for
 * MagicMirror modules. Include only the modules listed in the user's
 * configuration file. If the module is legacy (Module.register(...)),
 * wrap it in a compatible React component. If the module is a React
 * component, export it.
 */

const compatImport = (js, name) => {
  const globals = {
    Module,

  };
  // Evaluate the js with the values of globals in the global scope and wrap in component
  // eslint-disable-next-line no-new-func
  (new Function(...Object.keys(globals), js))(...Object.values(globals));
  return Module.createComponent(name);
};

codegen`
  const glob = require("glob");
  const node_path = require("path");
  const fs = require("fs");
  const esm = require("esm");
  let config = esm(module)("../shared/config");
  config = config.default || config;
  
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
    .map(([path, name]) => [path, name, fs.readFileSync(node_path.resolve("./modules", path), "utf8")])
    .map(([path, name, contents]) => {
        if (isReact(contents)) { 
          return "export {default as " + name + "} from './modules/" + name + "';";
        } else {
          const contentString = JSON.stringify(contents);
          return "export const " + name + " = compatImport(" + contentString + ", " + name + ");";
        }
      }
    ).join("\\n");
  console.log(JSON.stringify(module.exports));
`;



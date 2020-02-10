// This loader transforms MM2 modules into react components.
'use strict';
const path = require('path');
module.exports = function(content) {
  this.cacheable(true);
  this.addDependency('@mm/mm2');

  // if this is a mm2-style module,
  if (/^\s*Module\.register\(/m.test(content)) {
    // extract the name of the directory
    const resourceName = path.basename(path.dirname(this.resourcePath));
    this.getLogger().log(
      `Loading mm2-style module ${resourceName} from ${this.resourcePath}`
    );
    // export the result of calling mm2() with js source and name, and the resource path
    return `import mm2 from "@mm/mm2";\nimport config from "config/config";\nexport default mm2(${JSON.stringify(
      content
    )}, ${JSON.stringify(resourceName)}, config);\nexport const _path = ${
      this.resourePath
    }`;
  } else {
    return content;
  }
};


'use strict';
module.exports = function(babel) {
  const t = babel.types;
  t.isIdentifierOrLiteral = (node, name) =>
    t.isIdentifier(node, { name }) || t.isStringLiteral(node, { value: name });
  // const buildImport = path =>
  //   t.objectProperty(
  //     t.identifier('_import'),
  //     t.arrowFunctionExpression(
  //       [], // params
  //       t.callExpression(t.import(), [t.stringLiteral(path)])
  //     )
  //   );
  return {
    visitor: {
      ExpressionStatement(path) {
        const expression = path.get('expression');
        if (expression.isCallExpression()
        && expression.get('callee').isMemberExpression()
        && expression.get('callee.object').isIdentifier({name: "Module"})
        && expression.get('callee.property').isIdentifier({ name: "register"})) {
          path.replaceWith(t.exportDefaultDeclaration(expression))
        }
      }
    }
    // visitor: {
    //   ObjectProperty(path) {
    //     // find the "modules" property of the config object with an array value
    //     if (
    //       !path.node.computed &&
    //       t.isIdentifierOrLiteral(path.node.key, 'modules') &&
    //       t.isArrayExpression(path.node.value)
    //     ) {
    //       const elements = path.get('value.elements'); // get the array elements
    //       for (const element of elements) {
    //         // iterate over the objects in the array
    //         if (element.isObjectExpression()) {
    //           const properties = element.get('properties');
    //           for (const property of properties) {
    //             // find the "module" property of the object
    //             if (
    //               !property.node.computed &&
    //               t.isIdentifierOrLiteral(property.node.key, 'module') &&
    //               t.isStringLiteral(property.node.value)
    //             ) {
    //               let moduleName = property.node.value.value; // literal value of property value
    //               if (defaultModules.indexOf(moduleName) !== -1) {
    //                 moduleName = `default/${moduleName}`;
    //               }
    //               moduleName = `modules/${moduleName}`;
    //               // insert an _import property with a lazy dynamic import as its value
    //               const _import = buildImport(moduleName);
    //               property.insertAfter(_import);
    //               break; // don't search through other properties
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    // },
  };
};
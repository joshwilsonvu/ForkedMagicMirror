import Module from './module';
import makeCompat from "./make-compat";

export default (js, name, config) => {
  // Patch Module so that evaluating the script will set a local variable.
  let definition = null; // default to nothing
  Module._setDefinition = def => (definition = def);

  // Run the script as if the following variables were global
  const globals = {
    Module,
    config
  };
  // eslint-disable-next-line no-new-func
  new Function(...Object.keys(globals), js)(...Object.values(globals));

  Module._setDefinition = null; // unpatch
  return definition ? makeCompat(definition, name) : null
};

import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import nanoid from "nanoid";
import { usePublish, useSubscribe } from "./use-subscribe";

const MMContext = React.createContext(null);

// Expose a backwards-compatible hook version of the global MM variable
const useMM = () => {
  const modules = useSelector(s => s.modules);
  const dispatch = useDispatch();
  const publish = usePublish();

  return useMemo(() => ({
    sendNotification: publish,
    updateDom: (module, speed) => dispatch({ type: "UPDATE_DOM", identifier: module.identifier, speed }),
    getModules: () => setSelectionMethodsForModules(modules),
    hideModule: (module, speed, cb, options) => dispatch({ type: "HIDE_MODULE", identifier: module.identifier, speed, cb, options }),
    showModule: (module, speed, cb, options) => dispatch({ type: "SHOW_MODULE", identifier: module.identifier, speed, cb, options })
  }), [modules, dispatch, publish]);
};

/*const useCompat = () => {
  const { dispatch } = useContext(MMContext);
  const [identifier] = useState(() => nanoid(10)); // constant
  const [mm2] = useState(() => new MM2()); // constant
  const [dom, setDom] = useState(null);
  const [speed, setSpeed] = useState(1000);
};*/

/* setSelectionMethodsForModules()
	 * Adds special selectors on a collection of modules.
	 *
	 * argument modules array - Array of modules.
	 */
function setSelectionMethodsForModules(modules) {
  return Object.assign(modules, selectionMethods);
}

const selectionMethods = {
  /* withClass(className)
   * calls modulesByClass to filter modules with the specified classes.
   *
   * argument className string/array - one or multiple classnames. (array or space divided)
   *
   * return array - Filtered collection of modules.
   */
  withClass(className) {
    return this.modulesByClass(className, true);
  },

  /* exceptWithClass(className)
   * calls modulesByClass to filter modules without the specified classes.
   *
   * argument className string/array - one or multiple classnames. (array or space divided)
   *
   * return array - Filtered collection of modules.
   */
  exceptWithClass(className) {
    return this.modulesByClass(className, false);
  },

  /* modulesByClass(className, include)
   * filters a collection of modules based on classname(s).
   *
   * argument className string/array - one or multiple classnames. (array or space divided)
   * argument include boolean - if the filter should include or exclude the modules with the specific classes.
   *
   * return array - Filtered collection of modules.
   */
  modulesByClass(className, include) {
    let searchClasses = className;
    if (typeof className === "string") {
      searchClasses = className.split(" ");
    }

    let newModules = this.filter(function(module) {
      let classes = module.data.classes.toLowerCase().split(" ");

      for (let searchClass of searchClasses) {
        if (classes.indexOf(searchClass.toLowerCase()) !== -1) {
          return include;
        }
      }

      return !include;
    });

    setSelectionMethodsForModules(newModules);
    return newModules;
  },

  /* exceptModule(module)
   * Removes a module instance from the collection.
   *
   * argument module Module object - The module instance to remove from the collection.
   *
   * return array - Filtered collection of modules.
   */
  exceptModule(module) {
    let newModules = this.filter(function(mod) {
      return mod.identifier !== module.identifier;
    });

    setSelectionMethodsForModules(newModules);
    return newModules;
  },

  /* enumerate(callback)
   * Walks thru a collection of modules and executes the callback with the module as an argument.
   *
   * argument callback function - The function to execute with the module as an argument.
   */
  enumerate(callback) {
    this.map(function(module) {
      callback(module);
    });
  }
};

export default useMM;
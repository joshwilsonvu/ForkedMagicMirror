import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useMM, ModuleGuard } from "@mm/core";
import semver from "semver";

const usePrevious = value => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// An escape hatch from React. Pass the dom prop to imperatively add HTMLElements.
const Escape = ({ dom, className }) => {
  const div = useRef(null);
  const oldDom = usePrevious(dom);
  // add/replace/remove dom content
  useLayoutEffect(() => {
    if (dom && oldDom && dom !== oldDom) {
      div.current.replaceChild(dom, oldDom);
    } else if (dom && !oldDom) {
      div.current.appendChild(dom);
    } else if (!dom && oldDom) {
      div.current.removeChild(oldDom);
    } // else do nothing
  }, [dom, oldDom]);
  // cleanup on unmount
  useLayoutEffect(() => () => div.current.firstChild && div.current.removeChild(div.current.firstChild), []);
  return (<div ref={div} className={className}/>);
};

const useCompat = () => {

};

const makeCompat = (MM2, name) => {
  // Create a React component wrapping the given subclass
  const Compat = props => {
    const { identifier, hidden, classes, header, position, config, duration } = props;
    const data = { identifier, name, classes, header, position, config };

    const MM = useMM(identifier);
    const mm2 = useRef(null);
    const ref = useRef(null);
    // Set data, initialize, and start on mount
    useEffect(() => {
      mm2.current && mm2.current.setData(data);
    });
    useEffect(() => {
      // run this effect only once, to initialize everything
      const m = mm2.current = new MM2();
      if (m.requiresVersion && !semver.gt(m.requiresVersion, config.version)) {
        throw new Error(
          `Module ${name} requires MM version ${m.requiresVersion}, running ${config.version}`
        );
      }
      m.setData(data);
      m.MM = MM;
      m.init();
      m.loaded(() => null); // no longer required to call callback
      // FIXME: possible breakage, potentially calling start() before all modules loaded
      // MM.on('load or something', () => {
      m.start();
      // });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
      const l = mm2.current;
      l.hidden = hidden;
      l.setData(data); // FIXME: inefficient
    });


    const [dom, setDom] = useState(() => mm2.getDom());
    MM.on("updateDom", () => setDom(mm2.getDom())); // TODO: make real API
    return (
      <div
        id={identifier}
        className={data.classes}
        style={{ transitionDuration: duration }}
      >
        {typeof header !== "undefined" && header !== "" && (
          <header className="module-header" dangerouslySetInnerHTML={header}/>
        )}
        <ModuleGuard name={name}>
          <Escape
            ref={ref}
            className="module-content"
            dom={dom}
          />
        </ModuleGuard>
      </div>
    );
  };

  // Assign correct .name property to make development easier
  Object.defineProperty(Compat, "name", {
    value: name,
    configurable: true
  });

  return Compat;
};

export default makeCompat;

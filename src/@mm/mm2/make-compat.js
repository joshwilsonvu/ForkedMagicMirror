import React, { useState, useRef, useEffect, useLayoutEffect, useImperativeHandle, forwardRef } from "react";
import { useMM2, ModuleGuard } from "@mm/core";
import semver from "semver";
import { useSubscribe } from '@mm/core/use-subscribe';

const makeCompat = (MM2, name, globalConfig) => {
  const useMM2Instance = (data) => useState(() => {
    const mm2 = new MM2();
    mm2.setData(data);
    return mm2;
  })[0];
  // Create a React component wrapping the given subclass
  const Compat = forwardRef((props, ref) => {
    const { identifier, hidden, classes, header, position, config } = props;
    const data = { identifier, name, classes, header, position, config };

    const MM = useMM2(identifier);
    const mm2 = useMM2Instance(data);
    const [dom, setDom] = useState(() => mm2.getDom());

    //const ref = useRef(null);
    // Set data, initialize, and start on mount
    useEffect(() => {
      // run this effect only once, to initialize everything
      mm2.MM = MM;
      if (mm2.requiresVersion && globalConfig.version && !semver.gt(mm2.requiresVersion, globalConfig.version)) {
        throw new Error(
          `Module ${name} requires MM version ${mm2.requiresVersion}, running ${globalConfig.version}`
        );
      }
      mm2.loaded(() => null); // no longer required to call callback
      mm2.init();
      mm2.getDom().then(d => setDom(d));
    }, [mm2]); // eslint-disable-line react-hooks/exhaustive-deps
    useSubscribe("ALL_MODULES_LOADED", () => mm2.start());
    useSubscribe("UPDATE_DOM", payload => mm2.getDom().then(d => setDom(d)), identifier);
    useEffect(() => {
      mm2.hidden = hidden;
      mm2.setData(data); // FIXME: inefficient
    });

    return (
      <div
        id={identifier}
        className={data.classes}
      >
        {typeof header !== "undefined" && header !== "" && (
          <header className="module-header" dangerouslySetInnerHTML={header}/>
        )}
        <ModuleGuard name={name}>
          <Escape
            className="module-content"
            dom={dom}
          />
        </ModuleGuard>
      </div>
    );
  });

  // Assign correct .name property to make development easier
  Object.defineProperty(Compat, "name", {
    value: name,
    configurable: true
  });

  return Compat;
};

const useLayoutPrevious = value => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// An escape hatch from React. Pass the dom prop to imperatively add HTMLElements.
function Escape({ dom, ...rest }) {
  const div = useRef(null);
  const oldDom = useLayoutPrevious(dom);
  // add/replace/remove dom content
  useLayoutEffect(() => replace(div.current, oldDom, dom), [dom, oldDom]);
  // cleanup on unmount
  useLayoutEffect(() => () => replace(div.current, div.current.firstChild, null), []);
  return (<div ref={div} {...rest}/>);
}

function replace(parent, oldDom, newDom) {
  if (oldDom && newDom) {
    parent.replaceChild(newDom, oldDom);
  } else if (newDom && !oldDom) {
    parent.appendChild(newDom);
  } else if (!newDom && oldDom) {
    parent.removeChild(oldDom);
  } // else do nothing
}

export default makeCompat;

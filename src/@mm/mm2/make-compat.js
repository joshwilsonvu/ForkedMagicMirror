import React, { useState, useRef, useEffect, useLayoutEffect, useImperativeHandle, forwardRef } from "react";
import { useMM2, ModuleGuard } from "@mm/core";
import semver from "semver";
import { useSubscribe } from '@mm/core/use-subscribe';

const useUpdateDom = (ref, mm2) => {
  const [dom, setDom] = useState(() => mm2.getDom());
  useImperativeHandle(ref, () => ({
    updateDom() {
      setDom(mm2.getDom());
    }
  }), [mm2]);
  return dom;
};

const makeCompat = (MM2, name) => {
  const useMM2Instance = (MMGlobal) => useState(() => new MM2(MMGlobal))[0];
  // Create a React component wrapping the given subclass
  const Compat = forwardRef((props, ref) => {
    const { identifier, hidden, classes, header, position, config, duration } = props;
    const data = { identifier, name, classes, header, position, config };

    const MM = useMM2(identifier);
    const mm2 = useMM2Instance();
    const [dom, setDom] = useState(() => mm2.getDom());

    //const ref = useRef(null);
    // Set data, initialize, and start on mount
    useEffect(() => {
      // run this effect only once, to initialize everything
      mm2.MM = MM;
      if (mm2.requiresVersion && !semver.gt(mm2.requiresVersion, config.version)) {
        throw new Error(
          `Module ${name} requires MM version ${mm2.requiresVersion}, running ${config.version}`
        );
      }
      mm2.setData(data);
      mm2.loaded(() => null); // no longer required to call callback
      mm2.init();
    }, [mm2]); // eslint-disable-line react-hooks/exhaustive-deps
    useSubscribe("ALL_MODULES_LOADED", () => mm2.start());
    useSubscribe("UPDATE_DOM", () => setDom(mm2.getDom()), identifier);
    useEffect(() => {
      mm2.hidden = hidden;
      mm2.setData(data); // FIXME: inefficient
    });

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

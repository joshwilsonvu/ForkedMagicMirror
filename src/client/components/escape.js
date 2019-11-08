import React, { useRef, useEffect, useReducer, useImperativeHandle, forwardRef } from "react";

// Call forceUpdate() on a ref to this component to rerender
const useForceUpdate = ref => {
  const [updated, forceUpdate] = useReducer(x => x + 1, 0);
  useImperativeHandle(ref, () => ({ forceUpdate }), []);
  return updated;
};

// An escape hatch from React. Uses the getDom prop to imperatively add HTMLElements.
const Escape = forwardRef(({getDom, className}, ref) => {
  const updated = useForceUpdate(ref);

  const div = useRef(null);
  console.log("unconditional render");
  useEffect(() => {
    let abort = false;
    Promise.resolve(getDom(div.current.firstChild)).then((newDom = null) => {
      const oldDom = div.current.firstChild;
      if (!abort) {
        console.log(newDom, oldDom);
        if (newDom && oldDom) {
          div.current.replaceChild(newDom, div.current.firstChild);
          console.log("Rendered escaped content");
        } else if (newDom && !oldDom) {
          div.current.appendChild(newDom);
          console.log("Rendered new escaped content");
        } else if (!newDom && oldDom) {
          div.current.removeChild(oldDom);
        } // else do nothing
	  }
	});
    return () => { abort = true; }
  }, [updated, getDom]);
  useEffect(() => () => div.current.removeChild(div.current.firstChild), []);
  return <div ref={div} className={className}/>;
});

export default Escape;
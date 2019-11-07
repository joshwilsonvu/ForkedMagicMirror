import React, { useRef, useEffect, useReducer, useImperativeHandle, forwardRef } from "react";

const useForceUpdate = () => useReducer(x => x + 1, 0)[1];

// An escape hatch from React. Uses the getDom prop to imperatively add HTMLElements.
// Call forceUpdate() on a ref to this component to call getDom again, or change the getDom prop.
const Escape = forwardRef(({getDom}, ref) => {
  const forceUpdate = useForceUpdate();
  useImperativeHandle(ref, () => ({ forceUpdate }), []);
  useEffect(() => {
    let abort = false;
    getDom.then(dom => {
      if (!abort) {
        ref.current.replaceChild(dom, ref.current.firstChild);
	  }
	});
    return () => { abort = true; }
  });
  useEffect(() => () => ref.current.removeChild(ref.current.firstChild), []);
  return <div ref={ref} />;
});
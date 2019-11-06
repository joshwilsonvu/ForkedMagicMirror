import React, { useRef, useEffect, forwardRef } from "react";
import ReactDOM from "react-dom";

const Escape = forwardRef(({getDom, ...rest}, node) => {
  useEffect(() => {
    let unmounted = false;
    getDom.then(dom => {
      if (!unmounted) {
        node.current.append(dom);
	  }
	});
    return () => {
      unmounted = true;
      node.innerHTML = "";
	}
  });
  return <div ref={node} {...rest} />;
});
import React, { useRef, useEffect, useReducer, useImperativeHandle, forwardRef } from "react";
import useMM from "../hooks/useMM";

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

class ModuleGuard extends React.Component {
  constructor(props) {
	super(props);
	this.state = { hasError: false, errorInfo: "" };
  }

  static getDerivedStateFromError() {
	// Update state so the next render will show the fallback UI.
	return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
	console.log(`Whoops! There was an uncaught exception in module ${this.props.module.name}`);
	console.error(error, errorInfo);
	console.log("MagicMirror will not quit, but it might be a good idea to check why this happened.");
	console.log(`If you think this really is an issue, please open an issue on ${this.props.module.name}'s GitHub page.`);
	this.setState({errorInfo})
  }

  render() {
	if (this.state.hasError) {
	  if (process.env.NODE_ENV !== "production") {
		return (
		  <div>
			<h4>{`Something went wrong in module ${this.module.name}.`}</h4>
			{this.state.errorInfo && <pre>{this.state.errorInfo}</pre>}
		  </div>
		);
	  } else {
		return null; // don't display error'ed module in production
	  }
	} else {
	  return <>{this.props.children}</>;
	}
  }
}

const Module = ({}) => {

};

const makeCompat = module => {
  const MM = useMM();
  const ref = useRef(null);
  const {identifier, name} = module;
  const className = typeof module.data.classes === "string"
	? `module ${name} ${module.data.classes}`
	: name;

  const header = module.getHeader();
  return (
	<div id={identifier} className={className} style={{opacity}}>
	  {typeof header !== "undefined" && header !== "" && (
		<header className="module-header" dangerouslySetInnerHTML={header}/>
	  )}
	  <ModuleGuard module={module}>
		<Escape ref={ref} className="module-content" getDom={module.getDom}/>
	  </ModuleGuard>
	</div>
  );
};



export { makeCompat, Module };
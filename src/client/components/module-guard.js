import React from "react";

export default class ModuleGuard extends React.Component {
  constructor(props) {
	super(props);
	this.state = { hasError: false, errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
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
		return null;
	  }
	} else {
	  return <>{this.props.children}</>;
	}
  }
}
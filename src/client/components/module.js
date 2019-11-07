import React from "react";
import ModuleGuard from "./module-guard";

const Module = ({module, opacity = "100%"}) => {
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
		<div className="module-content">TODO: Here's your content</div>
	  </ModuleGuard>
	</div>
  );
};

export default Module;
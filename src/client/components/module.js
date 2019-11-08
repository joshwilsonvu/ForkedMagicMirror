import React from "react";
import ModuleGuard from "./module-guard";
import Escape from "./escape";

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
		<Escape className="module-content" getDom={module.getDom}/>
	  </ModuleGuard>
	</div>
  );
};

export default Module;
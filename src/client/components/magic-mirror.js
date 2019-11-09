/**
 * This component implements the MagicMirror
 */

import React, {useMemo, useReducer, useContext} from "react";
import Module from "./module";
import * as imports from "../loader";

const getDefaultRegions = () => ({
  "top_bar": [],
  "top_left": [],
  "top_center": [],
  "top_right": [],
  "upper_third": [],
  "middle_center": [],
  "lower_third": [],
  "bottom_left": [],
  "bottom_center": [],
  "bottom_right": [],
  "bottom_bar": [],
  "fullscreen_above": [],
  "fullscreen_below": []
});

const MMContext = React.createContext(null);
export const useMM = () => useContext(MMContext);
const MMReducer = (modules = [], {type, ...payload}) => {
  switch(type) {
  case "load":

    return modules;
  default:
    return modules;
  }
};

const MagicMirror = () => {
  const [modules, dispatch] = useReducer(MMReducer, []);
  // Divide modules into the various regions by their .data.position property
  const regions = useMemo(() => modules.reduce((regions, m) => {
	let pos = m.data.position;
	if (regions.hasOwnProperty(pos)) {
	  regions[pos].push(<Module module={m}/>);
	}
	return regions;
  }, getDefaultRegions()), [modules]);
  // Expose a backwards-compatible MM instance that can modify the mirror's state
  const MM = {

  }; // TODO
  return (
	<MMContext.Provider value={MM}>
	  <div className="region fullscreen below">
		<div className="container">{regions.fullscreen_below}</div>
	  </div>
	  <div className="region top bar">
		<div className="container">{regions.top_bar}</div>
		<div className="region top left">
		  <div className="container">{regions.top_left}</div>
		</div>
		<div className="region top center">
		  <div className="container">{regions.top_center}</div>
		</div>
		<div className="region top right">
		  <div className="container">{regions.top_right}</div>
		</div>
	  </div>
	  <div className="region upper third">
		<div className="container">{regions.upper_third}</div>
	  </div>
	  <div className="region middle center">
		<div className="container">{regions.middle_center}</div>
	  </div>
	  <div className="region lower third">
		<div className="container"><br/>{regions.lower_third}</div>
	  </div>
	  <div className="region bottom bar">
		<div className="container">{regions.bottom_bar}</div>
		<div className="region bottom left">
		  <div className="container">{regions.bottom_left}</div>
		</div>
		<div className="region bottom center">
		  <div className="container">{regions.bottom_center}</div>
		</div>
		<div className="region bottom right">
		  <div className="container">{regions.bottom_right}</div>
		</div>
	  </div>
	  <div className="region fullscreen above">
		<div className="container">{regions.fullscreen_above}</div>
	  </div>
	</MMContext.Provider>
  );
};

export default MagicMirror;
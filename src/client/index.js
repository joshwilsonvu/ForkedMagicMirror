import React from "react";
import ReactDOM from "react-dom";
import MM from "./components/mm";
import config from "../shared/config";
// make CSS globally available
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css";
import "./css/main.css";

let modules;
config.modules.forEach(m => {

});

const MM = {
  updateDom(module, speed) {
	if (!(module instanceof Module)) {
	  Log.error("updateDom: Sender should be a module.");
	  return;
	}

  }
};
ReactDOM.render(<MM modules={config.modules}/>, document.getElementById("root"));

import React from "react";
import ReactDOM from "react-dom";
import MagicMirror from "./components/magic-mirror";
import Module from "./legacy/module";
// make CSS globally available
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css";
import "./css/main.css";

let modules = [
  new (class extends Module {
	getDom() {
	  console.log("Getting dom");
	  let div = document.createElement("div");
	  div.append("It's fuckin happening!!!");
	  return div;
	}
  })({
	position: "middle_center",
	name: "test",
	identifier: "test-1",
	config: {foo: 2}
  })
];
/*config.modules.forEach(m => {

});*/

/*const MM = {
  updateDom(module, speed) {
	if (!(module instanceof Module)) {
	  Log.error("updateDom: Sender should be a module.");
	  return;
	}

  }
};*/
ReactDOM.render(<MagicMirror modules={modules}/>, document.getElementById("root"));

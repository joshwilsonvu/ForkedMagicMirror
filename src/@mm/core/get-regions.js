import {CSSTransition} from "react-transition-group";
import React from "react";
import "./fade.css";

const defaultRegions = {
  "undefined": [],
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
};

const getRegions = modules => {
  console.log(modules);
  // Divide modules into the various regions by their .position property
  const regions = {...defaultRegions};
  modules.forEach(module => {
    if (typeof module !== "object") {
      throw new Error(`Expected a config object, got ${module}.`);
    }
    if (!defaultRegions.hasOwnProperty(module.position)) {
      throw new Error(`Invalid position: ${module.position}`);
    }
    const { Component, speed, ...rest } = module;
    let timeout = typeof speed === "number" ? speed : 1000;
    // add CSSTransition here to apply key and make it a direct child of TransitionGroup
    regions[rest.position].push(
      <CSSTransition key={rest.identifier} in={!rest.hidden} classNames="fade" timeout={timeout} unmountOnExit>
        <Component {...rest} duration={timeout}/>
      </CSSTransition>
    );
  });
  return regions;
};

export default getRegions;
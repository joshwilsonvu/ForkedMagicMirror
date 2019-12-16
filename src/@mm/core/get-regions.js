import {CSSTransition} from "react-transition-group";
import React from "react";
import { List } from "immutable";
import "./fade.css";

const defaultRegions = List([
  "undefined",
  "top_bar",
  "top_left",
  "top_center",
  "top_right",
  "upper_third",
  "middle_center",
  "lower_third",
  "bottom_left",
  "bottom_center",
  "bottom_right",
  "bottom_bar",
  "fullscreen_above",
  "fullscreen_below"
]);

const getRegions = modules => {
  console.log(modules);
  // Divide modules into the various regions by their .position property
  return defaultRegions.map(region => {
    return modules
      .filter(module => module.position.toString() === region)
      .map(module => {
        if (typeof module !== "object") {
          throw new Error(`Expected a config object, got ${module}.`);
        }
        const { Component, speed, ...rest } = module;
        let timeout = typeof speed === "number" ? speed : 1000;
        // add CSSTransition here to apply key and make it a direct child of TransitionGroup
        if (!module.disabled && Component) {
          return (
            <CSSTransition key={rest.identifier} in={!rest.hidden} classNames="fade" timeout={timeout} unmountOnExit>
              <Component {...rest} duration={timeout}/>
            </CSSTransition>
          );
        }
      })
      .filter(Boolean);
  });

  modules.forEach();
  return regions;
};

export default getRegions;
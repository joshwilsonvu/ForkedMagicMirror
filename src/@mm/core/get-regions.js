import { CSSTransition } from 'react-transition-group';
import React, { lazy } from 'react';
//import { List, Seq } from "immutable";
import './fade.css';
import nanoid from 'nanoid';

const defaultRegions = [
  'none',
  'top_bar',
  'top_left',
  'top_center',
  'top_right',
  'upper_third',
  'middle_center',
  'lower_third',
  'bottom_left',
  'bottom_center',
  'bottom_right',
  'bottom_bar',
  'fullscreen_above',
  'fullscreen_below',
];

const getRegions = modules => {
  console.log(modules);
  // Divide modules into the various regions by their .position property
  const regions = defaultRegions.reduce((regions, region) => {
    regions[region] = modules.filter(module => !module.disabled && (module.position || 'none') === region /*&& React.isValidElement(module.Component)*/);
    return regions;
  }, {});
  console.log(regions);
  return regions;
};

export default getRegions;
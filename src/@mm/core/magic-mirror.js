/**
 * This component implements the MagicMirror
 */

import React, { useState } from 'react';
import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';
import nanoid from 'nanoid';
import { TransitionGroup } from 'react-transition-group';
import { List, Map, fromJS } from 'immutable';
import { Provider as NotificationProvider } from './use-subscribe';
import getRegions from './get-regions';


const MMReducer = (state, { type, ...payload }) => {
  if (typeof state === "undefined") {
    return MMInit
  }
  switch (type) {
    case 'HIDE_MODULE':
      return hideModule(true, state, payload)
    default:
      return state;
  }
};

function hideModule(hidden, state, payload) {
  const { identifier, speed, cb, options } = payload;
  return state.update(
    'modules',
    modules => modules.update(
      modules.findIndex(m => m.identifier === identifier),
      m => m.merge({ hidden, speed }),
    ),
  );
}

const MMInit = ({ children, config }) => {
  if (children) {

  }

  return fromJS({
    modules: config.modules.map(({ module, position, classes, header, disabled, config, _import }, i) => {
      if (_import) {
        return !disabled ? {
          hidden: false,
          speed: 1000,
          identifier: `m${nanoid(10)}`, // unique identifier for each module
          Component: React.lazy(_import), // _import is () => import("module")
          name: module,
          position,
          classes,
          header,
          config,
        } : false;
      } else {
        throw new Error(`Babel loader not working for ${module}.`);
      }
    }).filter(Boolean),
  });
};





const useModules = () => useSelector(state => state.get("modules"));

function MMLayout() {
  const modules = useModules();
  const {
    undefined: region_undefined, fullscreen_below, top_bar, top_left, top_center, top_right, upper_third, middle_center,
    lower_third, bottom_bar, bottom_left, bottom_center, bottom_right, fullscreen_above,
  } = getRegions(modules);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: 'none' }}>{region_undefined}</div>
      <div className="region fullscreen below">
        <TransitionGroup className="container">{fullscreen_below}</TransitionGroup>
      </div>
      <div className="region top bar">
        <TransitionGroup className="container">{top_bar}</TransitionGroup>
        <div className="region top left">
          <TransitionGroup className="container">{top_left}</TransitionGroup>
        </div>
        <div className="region top center">
          <TransitionGroup className="container">{top_center}</TransitionGroup>
        </div>
        <div className="region top right">
          <TransitionGroup className="container">{top_right}</TransitionGroup>
        </div>
      </div>
      <div className="region upper third">
        <TransitionGroup className="container">{upper_third}</TransitionGroup>
      </div>
      <div className="region middle center">
        <TransitionGroup className="container">{middle_center}</TransitionGroup>
      </div>
      <div className="region lower third">
        <br/><TransitionGroup className="container">{lower_third}</TransitionGroup>
      </div>
      <div className="region bottom bar">
        <TransitionGroup className="container">{bottom_bar}</TransitionGroup>
        <div className="region bottom left">
          <TransitionGroup className="container">{bottom_left}</TransitionGroup>
        </div>
        <div className="region bottom center">
          <TransitionGroup className="container">{bottom_center}</TransitionGroup>
        </div>
        <div className="region bottom right">
          <TransitionGroup className="container">{bottom_right}</TransitionGroup>
        </div>
      </div>
      <div className="region fullscreen above">
        <TransitionGroup className="container">{fullscreen_above}</TransitionGroup>
      </div>
    </React.Suspense>
  );
}

function MagicMirror({ m, children, config }) {
  // config is only initial arg, changing props doesn't do anything
  const store = useState(() => createStore(MMReducer, MMInit({children, config})))[0];
  return (
    <Provider store={store}>
      <NotificationProvider>
        <MMLayout/>
      </NotificationProvider>
    </Provider>
  );
}

export default MagicMirror;
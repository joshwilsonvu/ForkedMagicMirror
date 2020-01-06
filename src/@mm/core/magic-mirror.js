/**
 * This component implements the MagicMirror
 */

import React, { useState, lazy, Suspense, memo } from 'react';
import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';
import nanoid from 'nanoid';
import { Fader, FaderGroup, FadeTransition } from './fader';
import { Provider as NotificationProvider } from './use-subscribe';
import getRegions from './get-regions';


const MMReducer = (state, { type, ...payload }) => {
  switch (type) {
    case 'HIDE_MODULE':
      return hideModule(true, state, payload);
    case 'SHOW_MODULE':
      return hideModule(false, state, payload);
    default:
      return state;
  }
};

function hideModule(hidden, state, payload) {
  const { identifier, speed, cb, options } = payload;
  return {
    ...state,
    modules: state.modules.map(m => m.identifier === identifier ? { ...m, hidden, speed } : m),
  };
}

const MMInit = ({ children, config }) => {
  if (children) {

  }
  return {
    modules: config.modules
      .filter(({ disabled }) => !disabled)
      .map(m => {
        if (typeof m._import !== 'function' /*|| typeof m._path !== 'string'*/) {
          throw new Error(`Babel loader not working for ${m.module}.`);
        }
        return m;
      })
      .map(({ module, position, classes = '', header = '', config = {}, _import, _path }) => {
        return {
          hidden: false,
          speed: 1000,
          identifier: `m${nanoid(10)}`, // unique identifier for each module
          Component: lazy(_import), // _import is () => import("module"), done in loader to be statically analyzable
          path: _path,
          name: module,
          position,
          classes,
          header,
          config,
        };
      })
  };
};

const useModules = () => useSelector(state => state.modules);

const WrapModule = ({ module }) => {
  const { Component, hidden, speed, identifier, name, classes, header, config, path } = module;
  let timeout = typeof speed === 'number' ? speed : 1000;
  const props = { name, path, identifier, classNames: classes, header, ...config };
  // add CSSTransition here to apply key and make it a direct child of TransitionGroup
  return (
    <FadeTransition speed={speed} pose={hidden && "hidden"}>
      <Suspense fallback={<div>...</div>}>
        <Component {...props} duration={timeout}/>
      </Suspense>
    </FadeTransition>
  );
};

const WrapGroup = modules => (
  <FaderGroup className="container">{modules.map(module =>
    <WrapModule key={module.identifier} module={module}/>)}
  </FaderGroup>
);

function MMLayout() {
  const modules = useModules();
  const {
    none, fullscreen_below, top_bar, top_left, top_center, top_right, upper_third, middle_center,
    lower_third, bottom_bar, bottom_left, bottom_center, bottom_right, fullscreen_above,
  } = getRegions(modules);

  return (
    <>
      <div style={{ display: 'none' }}>{none}</div>
      <div className="region fullscreen below">
        {WrapGroup(fullscreen_below)}
      </div>
      <div className="region top bar">
        {WrapGroup(top_bar)}
        <div className="region top left">
          {WrapGroup(top_left)}
        </div>
        <div className="region top center">
          {WrapGroup(top_center)}
        </div>
        <div className="region top right">
          {WrapGroup(top_right)}
        </div>
      </div>
      <div className="region upper third">
        {WrapGroup(upper_third)}
      </div>
      <div className="region middle center">
        {WrapGroup(middle_center)}
      </div>
      <div className="region lower third">
        <br/>{WrapGroup(lower_third)}
      </div>
      <div className="region bottom bar">
        {WrapGroup(bottom_bar)}
        <div className="region bottom left">
          {WrapGroup(bottom_left)}
        </div>
        <div className="region bottom center">
          {WrapGroup(bottom_center)}
        </div>
        <div className="region bottom right">
          {WrapGroup(bottom_right)}
        </div>
      </div>
      <div className="region fullscreen above">
        {WrapGroup(fullscreen_above)}
      </div>
    </>
  );
}

function MagicMirror({ m, children, config }) {
  // config is only initial arg, changing props doesn't do anything
  const store = useState(() => createStore(MMReducer, MMInit({ children, config })))[0];
  return (
    <Provider store={store}>
      <NotificationProvider>
        <MMLayout/>
      </NotificationProvider>
    </Provider>
  );
}

export default MagicMirror;
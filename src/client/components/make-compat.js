import React, {useRef, useEffect} from 'react';
import useMM from '../hooks/useMM';
import cmpVersions from '../legacy/cmp-versions';
import {CSSTransition} from 'react-transition-group';
import usePrevious from '../hooks/usePrevious';
import '../legacy/fade.css';

// An escape hatch from React. Pass the dom prop to imperatively add HTMLElements.
const Escape = ({dom, className}) => {
  const div = useRef(null);
  const oldDom = usePrevious(dom);
  // add/replace/remove dom content
  useEffect(() => {
    if (dom && oldDom) {
      div.current.replaceChild(dom, oldDom);
    } else if (dom && !oldDom) {
      div.current.appendChild(dom);
    } else if (!dom && oldDom) {
      div.current.removeChild(oldDom);
    } // else do nothing
  }, [dom]);
  // cleanup on unmount
  useEffect(() => () => div.current.removeChild(div.current.firstChild), []);
  return <div ref={div} className={className}/>;
};

const makeCompat = (Legacy, name) => {
  // Create a React component wrapping the given subclass
  const Compat = props => {
    const {identifier, hidden, classes, header, position, config, speed} = props;
    const data = {identifier, name, classes, header, position, config};

    const MM = useMM();
    const legacy = useRef(null);
    const dom = useRef(null);
    const ref = useRef(null);
    // Set data, initialize, and start on mount
    useEffect(() => {
      legacy.current && legacy.current.setData(data);
    });
    useEffect(() => {
      const l = legacy.current = new Legacy();
      if (l.requiresVersion && cmpVersions(config.version, l.requiresVersion) < 0) {
        throw new Error(`Module ${Legacy.name} requires MM version ${l.requiresVersion}, running ${config.version}`);
      }
      l.setData(data);
      l.MM = MM;
      l.init();
      l.loaded(() => {
      }); // no longer required to call callback
      // FIXME: possible breakage, potentially calling start() before all modules loaded
      l.start();
    }, []);
    useEffect(() => {
      const l = legacy.current;
      l.hidden = hidden;
      l.setData(data); // FIXME: inefficient
    });

    let duration = (speed || speed === 0) ? speed : 1000;
    return (
      <CSSTransition
        in={!hidden}
        classNames="fade" /* references fade.css */
        timeout={duration}
      >
        <div id={identifier} className={data.classes} style={{transitionDuration: duration}}>
          {typeof header !== 'undefined' && header !== '' && (
            <header className="module-header" dangerouslySetInnerHTML={header}/>
          )}
          <ModuleGuard name={name}>
            <Escape ref={ref} className="module-content" dom={() => legacy.current.getDom()}/>
          </ModuleGuard>
        </div>
      </CSSTransition>
    );
  };

  // Assign correct .name property to make development easier
  Object.defineProperty(Compat, 'name', {value: Legacy.name, configurable: true});

  return Compat;
};

export default makeCompat;
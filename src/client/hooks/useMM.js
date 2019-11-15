import React, {useContext, useMemo} from "react";

const MMContext = React.createContext(null);

class MMClass {
  constructor(identifier, dispatch) {
    this.d = action => dispatch({...action, identifier});
  }
  updateDom(_, speed) {
    this.d({type: "UPDATE_DOM", speed});
  }
  sendNotification(notification, payload, module) {
	this.d({type: "SEND_NOTIFICATION", notification, payload, module});
  }
  hideModule(identifier, _, speed, cb) {
	this.d({type: "HIDE_MODULE", speed, cb});
  }
  showModule(identifier, _, speed, cb, options) {
	this.d({type: "SHOW_MODULE", speed, cb, options});
  }
}

// Expose a backwards-compatible MM instance that can modify the mirror's state
// Automatically called with component's identifier (see useMM())
export const MMProvider = ({dispatch, children}) => {
  return <MMContext.Provider value={dispatch} children={children} />;
};

const useMM = identifier => {
  const dispatch = useContext(MMContext);
  return useMemo(() => new MMClass(identifier, dispatch), [identifier, dispatch]);
};

export default useMM;

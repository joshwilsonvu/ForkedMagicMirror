import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import Emitter from "tiny-emitter";

const PubSubContext = createContext(null);

/*
 * To subscribe to a notification, call this hook with the name of the notification
 * to subscribe to and the function to be called when the notification comes in.
 *     useSubscribe("ALL_MODULES_LOADED", () => console.log("Loaded!"));
 */
export const useSubscribe = (event, subscriber, Context = PubSubContext) => {
  const pubsub = useContext(Context);
  useEffect(() => {
    if (event && subscriber) {
      pubsub.on(event, subscriber);
      return () => pubsub.off(event, subscriber);
    }
  }, [event, subscriber, pubsub]);
};

/*
 * To emit, use the return value of this hook in a useEffect() block.
 * It's not a good idea to call it in the render phase.
 *     const publish = usePublish();
 *     useEffect(() => fetch(something).then(content => publish("FETCHED", content)), [something]);
 */
export const usePublish = (Context = PubSubContext) => {
  const pubsub = useContext(Context);
  const [emitArgs, setEmitArgs] = useState(null);
  useEffect(() => {
    if (emitArgs) {
      if (typeof emitArgs[0] !== "string") {
        throw new TypeError(`Expected event name to be a string, got ${typeof emitArgs[0]}`);
      }
      // ensure emit only once with useEffect
      pubsub.emit(...emitArgs);
      setEmitArgs(null);
    }
  }, [emitArgs]);
  // return value of hook acts as emit function
  return useCallback((...args) => setEmitArgs(args), []);
};

export const createPubSubProvider = Context => {
  return props => {
    const [emitter] = useState(() => new Emitter());
    return <Context.Provider value={emitter} {...props} />
  }
};

export const NotificationProvider = createPubSubProvider(PubSubContext)

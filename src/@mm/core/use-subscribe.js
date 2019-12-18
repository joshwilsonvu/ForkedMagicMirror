import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import mitt from 'mitt';

const PubSubContext = createContext(null);

// Creates Provider, useSubscribe, and usePublish that use the given context. Useful for separate "rooms".
export const createPubSub = Context => {
  const destinationKey = Symbol("destination");

  function Provider(props) {
    const emitter = useState(mitt)[0];
    return <Context.Provider value={emitter} {...props} />;
  }

  /*
   * To subscribe to a notification, call this hook with the name of the notification
   * to subscribe to and the function to be called when the notification comes in.
   *     useSubscribe("ALL_MODULES_LOADED", payload => console.log("Loaded!"));
   *
   * Listen to all events with
   *     useSubscribe("*", (payload, event) => console.log("Received event " + event));
   *
   * If an optional third argument is supplied with a unique identifier, events from
   * usePublish(_, _, destination) will only reach subscribers with a matching identifier.
   *     useSubscribe("UPDATE", payload => console.log("Updated!"), "foo");
   *     ...
   *     const publish = usePublish();
   *     publish("UPDATE", {}, "foo");
   */
  function useSubscribe(event, subscriber, identity) {
    const emitter = useContext(Context);
    subscriber = useMemo(() => {
      let s = subscriber;
      if (s) {
        // change argument order to keep payload first when the event is a catch-all
        if (event === "*") {
          s = (type, payload, ...rest) => s(payload, type, ...rest);
        }
        // when the payload contains a destination, only call the subscriber if identity matches
        if (identity) {
          s = (payload, ...rest) => {
            if (!payload[destinationKey] || payload[destinationKey] === identity) {
              s(payload, ...rest);
            }
          }
        }
      }
      return s;
    }, [subscriber, event, identity]);
    useEffect(() => {
      if (event && subscriber) {
        emitter.on(event, subscriber);
        return () => emitter.off(event, subscriber);
      }
    }, [event, subscriber, emitter]);
  }

  /*
   * To emit, use the return value of this hook in a useEffect() block or event handler.
   * It's not a good idea to call it in the render phase as it could be called more than once.
   *     const publish = usePublish();
   *     useEffect(() => fetch(something).then(content => publish("FETCHED", content)), [something]);
   * To publish to a specific listener,
   *     publish("FETCHED", payload, destination) // "foo"
   */
  function usePublish() {
    const emitter = useContext(Context);
    // return value of hook acts as emit function
    return useCallback(
      (event, payload, destination) => {
        if (typeof payload !== "object") {
          payload = [payload]
        }
        emitter.emit(event, {
          ...payload,
          ...(destination && { [destinationKey]: destination })
        })
      },
      [emitter]
    );
  }

  return {
    Provider,
    useSubscribe,
    usePublish,
  };
};

const { Provider, useSubscribe, usePublish } = createPubSub(PubSubContext);
export {
  Provider,
  useSubscribe,
  usePublish
}

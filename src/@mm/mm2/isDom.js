/* Source: https://stackoverflow.com/a/384380/7619380 */

// Returns true if it is a DOM node
export function isNode(o) {
  return (
    typeof Node === "object"
      ? o instanceof Node
      : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
  );
}

// Returns true if it is a DOM element
export function isElement(o) {
  return (
    typeof HTMLElement === "object"
      ? o instanceof HTMLElement
      : o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
  );
}
import React, {useContext} from "react";

export const MMContext = React.createContext(null);
export default () => useContext(MMContext);
